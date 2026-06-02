from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from schemas import FarmerCreate, FarmerLogin, FarmerResponse
from crud import get_farmer_by_email, create_farmer
from passlib.context import CryptContext

router = APIRouter()
pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.post("/register", response_model=FarmerResponse)
def register(farmer: FarmerCreate, db: Session = Depends(get_db)):
    existing = get_farmer_by_email(db, farmer.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    return create_farmer(db, farmer)

@router.post("/login")
def login(farmer: FarmerLogin, db: Session = Depends(get_db)):
    db_farmer = get_farmer_by_email(db, farmer.email)
    if not db_farmer or not pwd.verify(farmer.password, db_farmer.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return {
    "message": "Login successful",
    "farmer_id": db_farmer.id,
    "name": db_farmer.name,
    "email": db_farmer.email,
    "location": db_farmer.location
}