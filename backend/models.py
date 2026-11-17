"""
SearchLab AI - Pydantic Request & Response Schemas
"""

from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class SearchRequest(BaseModel):
    query: str = Field(..., description="Search query string")
    category_filter: Optional[str] = Field("all", description="Category filter name or 'all'")
    min_score: Optional[float] = Field(0.0, description="Minimum cosine similarity score threshold (0.0 - 1.0)")
    sort_by: Optional[str] = Field("relevance", description="Sort order: 'relevance', 'title', or 'words'")

class PreprocessRequest(BaseModel):
    text: str = Field(..., description="Text input to process through the 6-stage NLP pipeline")

class CustomDocumentRequest(BaseModel):
    title: str = Field(..., min_length=1, max_length=200, description="Document title")
    category: Optional[str] = Field("General", max_length=100, description="Document category")
    content: str = Field(..., min_length=1, description="Plain text content of the document")

class SimilarityRequest(BaseModel):
    query: str = Field(..., description="User query to compare against document vectors")
    top_k: Optional[int] = Field(5, ge=1, le=20, description="Number of top similar documents to return")

class LiveTraceRequest(BaseModel):
    query: str = Field(..., description="Query for interactive step-by-step live search trace")
