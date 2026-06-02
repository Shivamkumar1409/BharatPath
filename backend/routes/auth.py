from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Farmer
from schemas import FarmerCreate, FarmerLogin
from crud import create_farmer, get_farmer_by_email, verify_password
from email_service import generate_otp, save_otp, verify_otp, send_otp_email
from pydantic import BaseModel

router = APIRouter()

# Temp store for pending registrations
# { email: { name, hashed_password } }
pending_registrations = {}

class OTPVerify(BaseModel):
    email: str
    otp: str

class ResendOTP(BaseModel):
    email: str

@router.post("/register")
def register(farmer: FarmerCreate, db: Session = Depends(get_db)):
    # Check if already exists
    existing = get_farmer_by_email(db, farmer.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered. Please login.")

    # Generate and send OTP
    otp = generate_otp()
    save_otp(farmer.email, otp)

    # Store pending registration
    from crud import hash_password
    pending_registrations[farmer.email] = {
        "name": farmer.name,
        "hashed_password": hash_password(farmer.password)
    }

    # Send OTP email
    email_sent = send_otp_email(farmer.email, otp, farmer.name)

    if email_sent:
        return {
            "message": "OTP sent to your email! Please verify.",
            "email": farmer.email,
            "otp_sent": True
        }
    else:
        # Email failed - still allow registration (OTP printed in terminal)
        return {
            "message": "OTP generated (email service not configured). Check terminal for OTP.",
            "email": farmer.email,
            "otp_sent": False
        }

@router.post("/verify-otp")
def verify_otp_endpoint(data: OTPVerify, db: Session = Depends(get_db)):
    # Verify OTP
    if not verify_otp(data.email, data.otp):
        raise HTTPException(status_code=400, detail="Invalid or expired OTP. Please try again.")

    # Get pending registration
    pending = pending_registrations.get(data.email)
    if not pending:
        raise HTTPException(status_code=400, detail="Registration session expired. Please register again.")

    # Check again if already registered (race condition)
    existing = get_farmer_by_email(db, data.email)
    if existing:
        del pending_registrations[data.email]
        raise HTTPException(status_code=400, detail="Email already registered.")

    # Create farmer in DB
    new_farmer = Farmer(
        name=pending["name"],
        email=data.email,
        hashed_password=pending["hashed_password"],
        is_verified=True
    )
    db.add(new_farmer)
    db.commit()
    db.refresh(new_farmer)

    # Clean up
    del pending_registrations[data.email]

    return {
        "message": "Email verified! Registration complete ✅",
        "name": new_farmer.name,
        "email": new_farmer.email
    }

@router.post("/resend-otp")
def resend_otp(data: ResendOTP):
    pending = pending_registrations.get(data.email)
    if not pending:
        raise HTTPException(status_code=400, detail="No pending registration found. Please register again.")

    otp = generate_otp()
    save_otp(data.email, otp)
    email_sent = send_otp_email(data.email, otp, pending["name"])

    return {
        "message": "New OTP sent!" if email_sent else "OTP regenerated (check terminal)",
        "otp_sent": email_sent
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