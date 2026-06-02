from fastapi import APIRouter  # 👈 Added this import
from pydantic import BaseModel, EmailStr
from typing import Optional

# 👈 Initialized the router so main.py doesn't crash
router = APIRouter()

class FarmerCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class FarmerLogin(BaseModel):
    email: EmailStr
    password: str
