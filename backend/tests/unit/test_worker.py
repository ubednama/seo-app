import pytest
import respx
from httpx import Response

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import sessionmaker

from api.v1.seo_reports import process_seo_analysis
from models.seo_report import SEOReport

@pytest.mark.asyncio
@respx.mock
async def test_process_seo_analysis_integration(db_session: AsyncSession):
    """
    A true integration test for the entire background analysis process.
    It mocks the external HTTP call but allows all other code to run as-is.
    """
    
    report = SEOReport(url="http://example.com", status="pending")
    db_session.add(report)
    await db_session.commit()
    await db_session.refresh(report)

    fake_html = "<html><head><title>Test Title</title></head><body><h1>Hi</h1></body></html>"
    respx.get("http://example.com").mock(return_value=Response(200, text=fake_html))

    await process_seo_analysis(
        report_id=report.id,
        url="http://example.com",
        include_ai_insights=False
    )

    async_session_maker = sessionmaker(
        bind=db_session.bind, class_=AsyncSession, expire_on_commit=False
    )
    async with async_session_maker() as new_session:
        fresh_report = await new_session.get(SEOReport, report.id)
        
        assert fresh_report.status == "completed"
        assert fresh_report.title == "Test Title"
        assert fresh_report.seo_score is not None