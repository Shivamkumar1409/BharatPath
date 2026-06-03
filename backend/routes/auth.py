from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Farmer
from schemas import FarmerCreate, FarmerLogin
from crud import create_farmer, get_farmer_by_email, verify_password

router = APIRouter()

@router.post("/register")
def register(farmer: FarmerCreate, db: Session = Depends(get_db)):
    existing = get_farmer_by_email(db, farmer.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered. Please login.")
    new_farmer = create_farmer(db, farmer)
    return {
        "success": True,
        "message": "Registration successful ✅",
        "name": new_farmer.name,
        "email": new_farmer.email
    }

@router.post("/login")
def login(farmer: FarmerLogin, db: Session = Depends(get_db)):
    db_farmer = get_farmer_by_email(db, farmer.email)
    if not db_farmer:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    if not verify_password(farmer.password, db_farmer.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return {
        "message": "Login successful",
        "name": db_farmer.name,
        "email": db_farmer.email
    }