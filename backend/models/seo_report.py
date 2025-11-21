from sqlalchemy import Column, Integer, String, Text, Float, DateTime, JSON, Boolean
from sqlalchemy.sql import func
from core.database import Base

class SEOReport(Base):
    __tablename__ = "seo_reports"
    
    id = Column(Integer, primary_key=True, index=True)
    url = Column(String(500), nullable=False, index=True)
    title = Column(String(200))
    meta_description = Column(String(500))
    h1_tags = Column(JSON)
    h2_tags = Column(JSON)
    images = Column(JSON)
    links = Column(JSON)
    load_time = Column(Float)
    accessibility_score = Column(Float)
    performance_score = Column(Float)
    seo_score = Column(Float)
    raw_metrics = Column(JSON, nullable=True)
    ai_insights = Column(Text)
    ai_recommendations = Column(JSON)
    status = Column(String(50), default="pending")  # pending, processing, completed, failed
    error_message = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    def __repr__(self):
        return f"<SEOReport(url='{self.url}', status='{self.status}', seo_score={self.seo_score})>"