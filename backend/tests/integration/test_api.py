from unittest.mock import patch
from httpx import AsyncClient
import pytest
from models.seo_report import SEOReport

@pytest.mark.asyncio
async def test_submit_analysis(async_client: AsyncClient):
    """Test the endpoint for submitting a URL for analysis."""
    with patch('api.v1.seo_reports.BackgroundTasks.add_task') as mock_add_task:
        response = await async_client.post("/api/v1/seo-reports/analyze", json={"url": "http://example.com", "include_ai_insights": True})
        assert response.status_code == 200
        data = response.json()
        assert "report_id" in data
        assert data["status"] == "processing"
        mock_add_task.assert_called_once()

@pytest.mark.asyncio
async def test_get_pdf_report(async_client: AsyncClient, db_session):
    """Test downloading a PDF report for a completed analysis."""
    # Seed the database with a completed report
    report = SEOReport(
        url="http://example.com",
        status="completed",
        seo_score=88,
        raw_metrics='{"title": "Test Title"}',
        ai_insights="AI summary",
        load_time=0.5,
        ai_recommendations=["Rec 1"]
    )
    db_session.add(report)
    await db_session.commit()
    await db_session.refresh(report)

    response = await async_client.get(f"/api/v1/seo-reports/{report.id}/pdf")
    assert response.status_code == 200
    assert response.headers["content-type"] == "application/pdf"
    assert response.headers["content-disposition"] == f'attachment; filename="report-{report.id}.pdf"'