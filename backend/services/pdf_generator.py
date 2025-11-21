from io import BytesIO
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib import colors
from datetime import datetime

def generate_report_pdf(analysis_data: dict) -> bytes:
    """
    Generates a professional PDF report from SEO analysis data.
    Matches the data structure provided by api/v1/seo_reports.py.
    """
    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer, 
        pagesize=letter, 
        rightMargin=72, 
        leftMargin=72, 
        topMargin=72, 
        bottomMargin=72
    )
    styles = getSampleStyleSheet()

    # --- Custom Styles ---
    styles.add(ParagraphStyle(name='BodyTextLeft', parent=styles['Normal'], alignment=TA_LEFT, leading=14))
    
    styles.add(ParagraphStyle(
        name='ReportHeader', 
        fontSize=28, 
        fontName='Helvetica-Bold', 
        alignment=TA_CENTER, 
        spaceAfter=8, 
        textColor=colors.darkblue
    ))
    
    styles.add(ParagraphStyle(
        name='SubHeader', 
        fontSize=10, 
        fontName='Helvetica', 
        alignment=TA_CENTER, 
        spaceAfter=20, 
        textColor=colors.darkgrey
    ))
    
    styles.add(ParagraphStyle(
        name='SectionHeader', 
        fontSize=18, 
        fontName='Helvetica-Bold', 
        spaceBefore=20, 
        spaceAfter=10, 
        textColor=colors.black, 
        leftIndent=0
    ))
    
    # --- Score Logic ---
    score = analysis_data.get('seo_score', 0)
    # Handle NoneType if score is missing
    if score is None: 
        score = 0
        
    def get_score_color(s):
        if s < 50: return colors.red
        elif 50 <= s <= 80: return colors.orange
        else: return colors.darkgreen
        
    score_style = ParagraphStyle(
        name='ScoreDisplay', 
        fontSize=56, 
        fontName='Helvetica-Bold', 
        alignment=TA_CENTER, 
        textColor=get_score_color(score), 
        spaceAfter=30
    )
    
    story = []

    # 1. Header
    story.append(Paragraph("SiteSage SEO Report", styles['ReportHeader']))
    story.append(Paragraph(f"URL: {analysis_data.get('url', 'N/A')}", styles['SubHeader']))
    story.append(Paragraph(f"Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", styles['SubHeader']))

    # 2. SEO Score
    story.append(Paragraph(str(score), score_style))

    # 3. Executive Summary
    # FIX: API sends 'ai_insights', not 'ai_summary'
    story.append(Paragraph("Executive Summary", styles['SectionHeader']))
    summary_text = analysis_data.get('ai_insights')
    if not summary_text:
        summary_text = "No AI summary available."
    story.append(Paragraph(str(summary_text), styles['BodyTextLeft'])) 
    story.append(Spacer(1, 12))

    # 4. Key Metrics
    story.append(Paragraph("Key Metrics", styles['SectionHeader']))
    raw_metrics = analysis_data.get('raw_metrics', {})
    
    # --- Helper to safely get counts ---
    def get_count(key_count, key_list):
        val = raw_metrics.get(key_count)
        if val is not None: return val
        lst = raw_metrics.get(key_list)
        if lst is isinstance(lst, list): return len(lst)
        return 0

    h1_count = get_count('h1_count', 'h1_tags')
    h2_count = get_count('h2_count', 'h2_tags')
    img_missing_alt = get_count('images_missing_alt', 'images_without_alt') # Adjust key based on your analyzer

    # --- Table Layout ---
    page_width = letter[0] - 72 * 2 
    col_widths = [page_width * 0.35, page_width * 0.65] 

    def make_value_paragraph(text):
        return Paragraph(str(text), styles['BodyTextLeft'])

    # Prepare load time
    load_time_sec = analysis_data.get('load_time')
    load_time_ms = f"{load_time_sec * 1000:.0f}" if load_time_sec else "N/A"

    metrics_data = [
        [Paragraph('<b>Metric</b>', styles['BodyTextLeft']), Paragraph('<b>Value</b>', styles['BodyTextLeft'])],
        ['Title', make_value_paragraph(raw_metrics.get('title', 'N/A'))],
        ['Meta Description', make_value_paragraph(raw_metrics.get('meta_description', 'N/A'))],
        ['H1 Count', make_value_paragraph(h1_count)],
        ['H2 Count', make_value_paragraph(h2_count)],
        ['Images Missing Alt', make_value_paragraph(img_missing_alt)],
        ['Load Time (ms)', make_value_paragraph(load_time_ms)],
    ]
    
    table = Table(metrics_data, colWidths=col_widths)
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#F2F2F2')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 8),
        ('TOPPADDING', (0, 0), (-1, 0), 8),
        ('BACKGROUND', (0, 1), (-1, -1), colors.white),
        ('ALIGN', (0, 0), (0, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#CCCCCC')),
        ('PADDINGLEFT', (0, 0), (-1, -1), 10), 
        ('PADDINGRIGHT', (0, 0), (-1, -1), 10),
        ('PADDINGTOP', (0, 1), (-1, -1), 5),
        ('PADDINGBOTTOM', (0, 1), (-1, -1), 5),
    ]))
    story.append(table)
    story.append(Spacer(1, 24))

    # 5. Recommendations
    story.append(Paragraph("AI Recommendations", styles['SectionHeader']))
    recommendations = analysis_data.get('ai_recommendations')
    
    if not recommendations:
        recommendations = ["No specific recommendations available."]
    
    for rec in recommendations:
        bullet = Paragraph(f"• {rec}", styles['BodyTextLeft'])
        story.append(bullet)
        story.append(Spacer(1, 6))

    doc.build(story)
    pdf_bytes = buffer.getvalue()
    buffer.close()
    return pdf_bytes