from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import FarmerProfile
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

class ProfileData(BaseModel):
    email: str
    state: Optional[str] = None
    district: Optional[str] = None
    village: Optional[str] = None
    land_size: Optional[str] = None
    land_type: Optional[str] = None
    primary_crop: Optional[str] = None
    secondary_crops: Optional[str] = None
    irrigation_type: Optional[str] = None
    fertilizer_type: Optional[str] = None
    farming_experience: Optional[str] = None
    organic_certified: Optional[bool] = False
    soil_health_card: Optional[bool] = False
    annual_income: Optional[str] = None
    farming_capacity: Optional[str] = None
    has_loan: Optional[bool] = False
    loan_amount: Optional[str] = None
    loan_purpose: Optional[str] = None

@router.post("/save")
def save_profile(data: ProfileData, db: Session = Depends(get_db)):
    try:
        existing = db.query(FarmerProfile)\
            .filter(FarmerProfile.email == data.email)\
            .first()
        if existing:
            for key, value in data.dict(exclude={"email"}).items():
                setattr(existing, key, value)
            db.commit()
            db.refresh(existing)
        else:
            new_profile = FarmerProfile(**data.dict())
            db.add(new_profile)
            db.commit()
            db.refresh(new_profile)
        return {"message": "Profile saved ✅", "email": data.email}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/get/{email}")
def get_profile(email: str, db: Session = Depends(get_db)):
    try:
        profile = db.query(FarmerProfile)\
            .filter(FarmerProfile.email == email)\
            .first()
        if not profile:
            return {"exists": False, "profile": None}
        return {
            "exists": True,
            "profile": {
                "state": profile.state or "",
                "district": profile.district or "",
                "village": profile.village or "",
                "landSize": profile.land_size or "",
                "landType": profile.land_type or "",
                "primaryCrop": profile.primary_crop or "",
                "secondaryCrops": profile.secondary_crops or "",
                "irrigationType": profile.irrigation_type or "",
                "fertilizerType": profile.fertilizer_type or "",
                "farmingExperience": profile.farming_experience or "",
                "organicCertified": profile.organic_certified or False,
                "soilHealthCard": profile.soil_health_card or False,
                "annualIncome": profile.annual_income or "",
                "farmingCapacity": profile.farming_capacity or "",
                "hasLoan": profile.has_loan or False,
                "loanAmount": profile.loan_amount or "",
                "loanPurpose": profile.loan_purpose or "",
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/test")
def test():
    return {"message": "Profile route working ✅"}