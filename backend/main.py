import json
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.config import settings
from core.database import engine, Base
from api.v1 import seo_reports

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    description="""
    ## SEO Performance Analyzer API
    
    A comprehensive SEO analysis platform that provides:
    
    - **Automated SEO Audits**: Analyze websites for SEO performance, accessibility, and technical issues
    - **AI-Powered Insights**: Get intelligent recommendations using OpenAI GPT-4
    - **Performance Metrics**: Measure page load times, accessibility scores, and SEO scores
    - **Historical Tracking**: Track SEO performance over time
    - **Batch Analysis**: Analyze multiple URLs simultaneously
    - **PDF Reports**: Generate professional SEO audit reports
    
    ## Features
    
    ### 🔍 SEO Analysis
    - Title tag optimization
    - Meta description analysis
    - Heading structure (H1, H2) evaluation
    - Image optimization checks
    - Link analysis (internal/external)
    - Page load performance
    
    ### 🤖 AI Insights
    - Intelligent SEO recommendations
    - Content optimization suggestions
    - Technical SEO improvements
    - Competitive analysis insights
    
    ### 📊 Reporting
    - Comprehensive SEO scores
    - Accessibility assessments
    - Performance metrics
    - Professional PDF reports
    
    ## Getting Started
    
    1. Submit a URL for analysis using `POST /api/v1/seo-reports/analyze`
    2. Check analysis status and retrieve results
    3. Generate PDF reports for stakeholders
    4. Track historical performance over time
    """,
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    contact={
        "name": "Madeline & Co. SiteSage Support",
        "email": "support@sitesage.com",
    },
    license_info={
        "name": "MIT License",
        "url": "https://opensource.org/licenses/MIT",
    },
    servers=[
        {"url": "http://localhost:8000", "description": "Development server"},
        {"url": "https://api.sitesage.com", "description": "Production server"},
    ],
)

origins_str = os.getenv("ALLOWED_ORIGINS", '["http://localhost:3000", "http://127.0.0.1:3000"]')

try:
    allow_origins = json.loads(origins_str)
except json.JSONDecodeError:
    allow_origins = ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    expose_headers=["*"],
)

app.include_router(seo_reports.router, prefix=f"{settings.API_V1_STR}/seo-reports", tags=["seo-reports"])
@app.get("/")
async def root():
    return {"message": "SEO Performance Analyzer API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}