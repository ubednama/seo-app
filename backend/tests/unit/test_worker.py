from unittest.mock import patch, MagicMock
import pytest
import httpx
from api.v1.seo_reports import process_seo_analysis
from models.seo_report import SEOReport

@pytest.mark.asyncio
async def test_process_seo_analysis(db_session):
    """Test the entire background analysis process."""
    # 1. Setup: Create a report to be processed
    report = SEOReport(url="http://example.com", status="pending")
    db_session.add(report)
    await db_session.commit()
    await db_session.refresh(report)

    # 2. Mock external services
    fake_html = "<html><head><title>Test</title></head><body><h1>Hi</h1></body></html>"
    fake_ai_results = {"summary": "Good job!", "recommendations": ["Keep it up"]}

    # Mock AIInsightGenerator
    mock_ai_generator = MagicMock()
    mock_ai_generator.generate_insights.return_value = fake_ai_results

    # Mock httpx.AsyncClient response
    mock_response = MagicMock()
    mock_response.text = fake_html
    mock_response.raise_for_status = MagicMock()

    with patch('api.v1.seo_reports.httpx') as mock_httpx, \
         patch('api.v1.seo_reports.AIInsightGenerator', return_value=mock_ai_generator):
        mock_httpx.RequestError = httpx.RequestError
        mock_httpx.AsyncClient.return_value.__aenter__.return_value.get.return_value = mock_response
        
        # 3. Run the background task
        await process_seo_analysis(report.id, "http://example.com", True, db_session)

    # 4. Assertions: Check if the DB record was updated correctly
    await db_session.refresh(report)

    assert report.status == "completed"
    assert report.seo_score is not None
    assert report.ai_insights == "Good job!"
    assert "Keep it up" in report.ai_recommendations
    assert report.completed_at is not None