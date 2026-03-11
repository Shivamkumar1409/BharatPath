from pydantic import BaseModel
from typing import Optional

class FarmerCreate(BaseModel):
    name: str
    email: str
    password: str
    location: Optional[str] = None
    farm_size: Optional[float] = None
    crop_type: Optional[str] = None

class FarmerLogin(BaseModel):
    email: str
    password: str

class FarmerResponse(BaseModel):
    id: int
    name: str
    email: str
    location: Optional[str] = None
    crop_type: Optional[str] = None

    class Config:
        from_attributes = True