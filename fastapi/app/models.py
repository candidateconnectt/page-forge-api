from pydantic import BaseModel, Field
from typing import Optional, Dict, Any

class Page(BaseModel):
    id: str = Field(alias="_id")
    type: str = Field(alias="_type")
    title: str
    slug: Dict[str, str]
    body: Optional[Any] = ""
    image_url: Optional[str] = ""
    seo_description: Optional[str] = ""
    category: Optional[str] = ""
    validation_status: Optional[str] = ""

    class Config:
        populate_by_name = True
        extra = "allow"