import pytest
from services.seo_analyzer import SEOAnalyzer
from services.pdf_generator import generate_report_pdf

@pytest.fixture
def analyzer():
    return SEOAnalyzer()

def test_seo_analyzer_perfect_html(analyzer):
    """Test SEOAnalyzer with a perfectly optimized HTML page."""
    html_content = """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <title>This is a Perfect Title for SEO</title>
        <meta name="description" content="This is a perfect meta description, well-crafted and within the ideal length for search engine results pages.">
    </head>
    <body>
        <h1>Main Heading of the Page</h1>
        <h2>Subheading 1</h2>
        <h2>Subheading 2</h2>
        <img src="image.jpg" alt="A descriptive alt text for the image.">
        <a href="/internal-page">Internal Link</a>
    </body>
    </html>
    """
    results = analyzer.analyze(html_content, 500, "http://example.com")
    assert results['score'] == 100

def test_seo_analyzer_broken_html(analyzer):
    """Test SEOAnalyzer with HTML that has many SEO issues."""
    html_content = """
    <html>
    <body>
        <h1>First H1</h1>
        <h1>Second H1</h1>
        <img src="image.jpg">
    </body>
    </html>
    """
    results = analyzer.analyze(html_content, 2500, "http://example.com")
    assert results['score'] < 50

def test_generate_report_pdf():
    """Test that generate_report_pdf returns bytes starting with %PDF."""
    analysis_data = {
        "url": "http://example.com",
        "seo_score": 88,
        "ai_summary": "This is a test summary.",
        "ai_recommendations": ["Recommendation 1", "Recommendation 2"],
        "raw_metrics": {},
        "load_time": 0.5
    }
    pdf_bytes = generate_report_pdf(analysis_data)
    assert isinstance(pdf_bytes, bytes)
    assert pdf_bytes.startswith(b'%PDF')