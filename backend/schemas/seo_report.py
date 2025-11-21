from pydantic import BaseModel, HttpUrl, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class SEOReportCreate(BaseModel):
    url: HttpUrl = Field(..., description="Website URL to analyze")

class SEOReportResponse(BaseModel):
    id: int
    url: str
    title: Optional[str] = None
    meta_description: Optional[str] = None
    h1_tags: Optional[List[str]] = None
    h2_tags: Optional[List[str]] = None
    images: Optional[List[Dict[str, Any]]] = None
    links: Optional[List[Dict[str, Any]]] = None
    load_time: Optional[float] = None
    accessibility_score: Optional[float] = None
    performance_score: Optional[float] = None
    seo_score: Optional[float] = None
    ai_insights: Optional[str] = None
    ai_recommendations: Optional[List[str]] = None
    status: str
    error_message: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    model_config = {"from_attributes": True}

class SEOReportList(BaseModel):
    reports: List[SEOReportResponse]
    total: int
    page: int
    per_page: int

class SEOAnalysisRequest(BaseModel):
    url: HttpUrl = Field(..., description="Website URL to analyze")
    include_ai_insights: bool = Field(True, description="Include AI-generated insights")

class SEOAnalysisResponse(BaseModel):
    report_id: int
    status: str
    message: str