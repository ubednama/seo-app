import httpx
import json
import time
import logging
import re
import unicodedata
import os
from urllib.parse import urlparse
from datetime import datetime, timezone
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, Query
from fastapi.responses import Response
from sqlalchemy.orm import Session
from sqlalchemy import select, func

# --- Local Imports ---
from core.database import get_db
from models.seo_report import SEOReport
from services.seo_analyzer import SEOAnalyzer
from schemas.seo_report import ( 
    SEOReportResponse, 
    SEOReportList,
    SEOAnalysisRequest,
    SEOAnalysisResponse
)
from services.ai_insights import AIInsightGenerator
from services.pdf_generator import generate_report_pdf

# --- Settings Configuration ---
# We try to import settings from core.config. 
# If that fails, we load them directly here to ensure the API Key is found.
try:
    from core.config import settings
except ImportError:
    from pydantic_settings import BaseSettings, SettingsConfigDict
    class Settings(BaseSettings):
        model_config = SettingsConfigDict(env_file=".env", extra='ignore')
        GOOGLE_API_KEY: str = os.getenv("GOOGLE_API_KEY", "")
    settings = Settings()

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/analyze", response_model=SEOAnalysisResponse)
async def analyze_url(
    request: SEOAnalysisRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """
    Submit a URL for comprehensive SEO analysis.
    """
    try:
        # Check if recent analysis exists
        result = await db.execute(
            select(SEOReport).filter(
                SEOReport.url == str(request.url),
                SEOReport.status == "completed"
            ).order_by(SEOReport.created_at.desc())
        )
        existing_report = result.scalars().first()
        
        if existing_report:
            return SEOAnalysisResponse(
                report_id=existing_report.id,
                status="completed",
                message="Analysis completed successfully"
            )
        
        # Create new report
        report = SEOReport(
            url=str(request.url),
            status="pending"
        )
        db.add(report)
        await db.commit()
        await db.refresh(report)
        
        # Process analysis in background
        background_tasks.add_task(
            process_seo_analysis,
            report.id,
            str(request.url),
            request.include_ai_insights,
            db
        )
        
        return SEOAnalysisResponse(
            report_id=report.id,
            status="processing",
            message="Analysis started successfully"
        )
        
    except Exception as e:
        logger.error(f"Error submitting analysis request: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/{report_id}", response_model=SEOReportResponse)
async def get_report(report_id: int, db: Session = Depends(get_db)):
    """
    Retrieve a comprehensive SEO report by ID.
    """
    result = await db.execute(select(SEOReport).filter(SEOReport.id == report_id))
    report = result.scalars().first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    return report

@router.get("/", response_model=SEOReportList)
async def list_reports(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    status: Optional[str] = Query(None),
    url: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """
    List SEO reports with pagination.
    """
    query = select(SEOReport)
    
    if status:
        query = query.filter(SEOReport.status == status)
    
    if url:
        query = query.filter(SEOReport.url.contains(url))
    
    total_result = await db.execute(select(func.count()).select_from(query.alias()))
    total = total_result.scalar_one()
    
    result = await db.execute(query.order_by(SEOReport.created_at.desc()).offset(skip).limit(limit))
    reports = result.scalars().all()
    
    return SEOReportList(
        reports=reports,
        total=total,
        page=skip // limit + 1,
        per_page=limit
    )

async def process_seo_analysis(
    report_id: int,
    url: str,
    include_ai_insights: bool,
    db: Session
):
    """
    Asynchronously process a URL to perform SEO analysis.
    """
    result = await db.execute(select(SEOReport).filter(SEOReport.id == report_id))
    report = result.scalars().first()
    if not report:
        logger.error(f"Report with ID {report_id} not found.")
        return

    report.status = "processing"
    await db.commit()

    try:
        # Step 1: Fetch URL content
        start_time = time.time()
        async with httpx.AsyncClient() as client:
            # Pretend to be a real browser to avoid 403s
            headers = {'User-Agent': 'Mozilla/5.0 (compatible; SiteSage/1.0)'}
            response = await client.get(url, headers=headers, follow_redirects=True, timeout=30)
            response.raise_for_status()
            html_content = response.text
            response_time_ms = int((time.time() - start_time) * 1000)

        # Step 2: Analyze the content
        analyzer = SEOAnalyzer()
        analysis_results = analyzer.analyze(html_content, response_time_ms, url)

        # Step 3: Generate AI insights (FIXED LOGIC)
        ai_summary = None
        ai_recommendations = None
        
        if include_ai_insights:
            model_name = settings.MODEL_NAME if hasattr(settings, 'MODEL_NAME') else 'gemini-1.5-flash'
            api_key = settings.GOOGLE_API_KEY
            
            if api_key:
                try:
                    ai_generator = AIInsightGenerator(api_key=api_key, model_name=model_name)
                    ai_results = ai_generator.generate_insights(analysis_results)
                    ai_summary = ai_results.get('summary')
                    ai_recommendations = ai_results.get('recommendations')
                except Exception as e:
                    logger.error(f"AI Generation failed: {e}")
                    ai_summary = "AI analysis failed during generation."
            else:
                logger.warning("GOOGLE_API_KEY missing in settings. Skipping AI.")
                ai_summary = "AI Configuration missing (API Key)."

        # Step 4: Save results
        report.status = "completed"
        report.completed_at = datetime.now(timezone.utc)
        report.seo_score = analysis_results.get('score')
        report.raw_metrics = json.dumps(analysis_results)
        report.ai_insights = ai_summary
        report.ai_recommendations = ai_recommendations
        
        report.title = analysis_results.get('title')
        report.meta_description = analysis_results.get('meta_description')
        report.load_time = response_time_ms / 1000.0 

        await db.commit()
        logger.info(f"Successfully processed and saved report for {url}")

    except httpx.RequestError as e:
        logger.error(f"HTTP fetch failed for {url}: {e}")
        report.status = "failed"
        report.error_message = f"Failed to fetch URL: {e}"
        await db.commit()
    except Exception as e:
        logger.error(f"Unexpected error for {url}: {e}")
        report.status = "failed"
        report.error_message = f"An unexpected error occurred: {str(e)}"
        await db.commit()

@router.get("/{report_id}/pdf")
async def get_report_pdf(report_id: int, db: Session = Depends(get_db)):
    """
    Generate and download a PDF report.
    """
    result = await db.execute(select(SEOReport).filter(SEOReport.id == report_id))
    report = result.scalars().first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    if report.status != "completed":
        raise HTTPException(status_code=400, detail="Report analysis is still in progress or failed.")

    # Prepare data for the PDF generator
    try:
        raw_metrics = json.loads(report.raw_metrics) if report.raw_metrics else {}
    except json.JSONDecodeError:
        raw_metrics = {}

    analysis_data = {
        "url": report.url,
        "seo_score": report.seo_score,
        "ai_insights": report.ai_insights,
        "ai_recommendations": report.ai_recommendations,
        "raw_metrics": raw_metrics,
        "load_time": report.load_time,
        "created_at": report.created_at
    }

    # Generate PDF
    pdf_bytes = generate_report_pdf(analysis_data)

    # --- FIXED FILENAME LOGIC ---
    def sanitize_filename(name: str) -> str:
        """
        Robust sanitization for filenames:
        1. Normalize Unicode (converts accents, removes weird symbols like ■).
        2. Convert to ASCII (strip remaining non-ascii).
        3. Replace symbols with underscores.
        """
        if not name:
            return "report"
            
        # Normalize unicode (e.g. "Google ■ Gemini" -> "Google  Gemini")
        normalized = unicodedata.normalize('NFKD', name)
        
        # Encode to ASCII and ignore errors to strip weird chars
        ascii_name = normalized.encode('ascii', 'ignore').decode('ascii')
        
        # Replace invalid chars
        s = re.sub(r'[\\/:*?"<>|\s]+', '_', ascii_name)
        
        # Collapse underscores
        s = re.sub(r'_+', '_', s)
        s = s.strip('_')
        
        if not s:
            return "report"
            
        return s[:100]

    if report.title and report.title.strip():
        base_name = report.title
    else:
        parsed_url = urlparse(report.url)
        base_name = parsed_url.hostname or "report"

    sanitized_name = sanitize_filename(base_name)
    filename = f"{sanitized_name}.pdf"

    logger.info(f"Generated filename: {filename}")

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"'
        }
    )

@router.post("/batch-analyze")
async def batch_analyze_urls(
    urls: List[str],
    include_ai_insights: bool = True,
    background_tasks: BackgroundTasks = BackgroundTasks(),
    db: Session = Depends(get_db)
):
    """
    Analyze multiple URLs in batch.
    """
    try:
        import uuid
        batch_id = f"batch_{uuid.uuid4().hex[:8]}"
        report_ids = []
        
        for url in urls:
            report = SEOReport(
                url=url,
                status="pending"
            )
            db.add(report)
            db.commit()
            db.refresh(report)
            report_ids.append(report.id)
            
            background_tasks.add_task(
                process_seo_analysis,
                report.id,
                url,
                include_ai_insights,
                db
            )
        
        return {
            "batch_id": batch_id,
            "total_urls": len(urls),
            "submitted_reports": report_ids,
            "status": "processing",
            "message": f"Batch analysis started for {len(urls)} URLs"
        }
        
    except Exception as e:
        logger.error(f"Error submitting batch analysis: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/historical/{url:path}")
async def get_historical_reports(
    url: str,
    days: int = 30,
    db: Session = Depends(get_db)
):
    """
    Retrieve historical SEO analysis for a specific URL.
    """
    try:
        from datetime import timedelta
        
        days = min(days, 365)
        start_date = datetime.now(timezone.utc) - timedelta(days=days)
        
        reports = db.query(SEOReport).filter(
            SEOReport.url == url,
            SEOReport.status == "completed",
            SEOReport.created_at >= start_date
        ).order_by(SEOReport.created_at.desc()).all()
        
        if not reports:
            return {
                "url": url,
                "total_reports": 0,
                "time_period_days": days,
                "reports": [],
                "trends": {
                    "seo_score_change": 0,
                    "accessibility_change": 0,
                    "performance_change": 0
                }
            }
        
        if len(reports) >= 2:
            latest = reports[0]
            earliest = reports[-1]
            trends = {
                "seo_score_change": (latest.seo_score or 0) - (earliest.seo_score or 0),
                "accessibility_change": (latest.accessibility_score or 0) - (earliest.accessibility_score or 0),
                "performance_change": (latest.performance_score or 0) - (earliest.performance_score or 0)
            }
        else:
            trends = {
                "seo_score_change": 0,
                "accessibility_change": 0,
                "performance_change": 0
            }
        
        return {
            "url": url,
            "total_reports": len(reports),
            "time_period_days": days,
            "reports": [
                {
                    "id": report.id,
                    "seo_score": report.seo_score,
                    "accessibility_score": report.accessibility_score,
                    "performance_score": report.performance_score,
                    "created_at": report.created_at.isoformat() if report.created_at else None
                }
                for report in reports
            ],
            "trends": trends
        }
        
    except Exception as e:
        logger.error(f"Error retrieving historical reports: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/stats/summary")
async def get_stats_summary(db: Session = Depends(get_db)):
    """
    Get comprehensive statistics and summary of all SEO analyses.
    """
    try:
        from sqlalchemy import func
        
        total_analyses = db.query(SEOReport).count()
        completed_analyses = db.query(SEOReport).filter(SEOReport.status == "completed").count()
        success_rate = (completed_analyses / total_analyses * 100) if total_analyses > 0 else 0
        
        avg_seo_score = db.query(func.avg(SEOReport.seo_score)).filter(SEOReport.status == "completed").scalar() or 0
        avg_accessibility_score = db.query(func.avg(SEOReport.accessibility_score)).filter(SEOReport.status == "completed").scalar() or 0
        avg_performance_score = db.query(func.avg(SEOReport.performance_score)).filter(SEOReport.status == "completed").scalar() or 0
        
        from datetime import timedelta
        recent_cutoff = datetime.now(timezone.utc) - timedelta(days=7)
        recent_analyses = db.query(SEOReport).filter(SEOReport.created_at >= recent_cutoff).count()
        
        top_urls_query = db.query(
            SEOReport.url,
            func.count(SEOReport.id).label('analysis_count'),
            func.avg(SEOReport.seo_score).label('avg_seo_score')
        ).filter(
            SEOReport.status == "completed"
        ).group_by(
            SEOReport.url
        ).order_by(
            func.count(SEOReport.id).desc()
        ).limit(5).all()
        
        top_urls = [
            {
                "url": url,
                "analysis_count": count,
                "avg_seo_score": round(avg_score, 1) if avg_score else 0
            }
            for url, count, avg_score in top_urls_query
        ]
        
        return {
            "total_analyses": total_analyses,
            "completed_analyses": completed_analyses,
            "success_rate": round(success_rate, 1),
            "average_seo_score": round(avg_seo_score, 1),
            "average_accessibility_score": round(avg_accessibility_score, 1),
            "average_performance_score": round(avg_performance_score, 1),
            "recent_analyses": recent_analyses,
            "top_urls": top_urls
        }
        
    except Exception as e:
        logger.error(f"Error generating stats summary: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")