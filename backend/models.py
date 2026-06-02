from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text
from sqlalchemy.sql import func
from database import Base

class Farmer(Base):
    __tablename__ = "farmers"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class FarmerProfile(Base):
    __tablename__ = "farmer_profiles"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    # Farm Details
    state = Column(String, nullable=True)
    district = Column(String, nullable=True)
    village = Column(String, nullable=True)
    land_size = Column(String, nullable=True)
    land_type = Column(String, nullable=True)
    primary_crop = Column(String, nullable=True)
    secondary_crops = Column(String, nullable=True)
    irrigation_type = Column(String, nullable=True)
    fertilizer_type = Column(String, nullable=True)
    farming_experience = Column(String, nullable=True)
    organic_certified = Column(Boolean, default=False)
    soil_health_card = Column(Boolean, default=False)
    # Financial Details
    annual_income = Column(String, nullable=True)
    farming_capacity = Column(String, nullable=True)
    has_loan = Column(Boolean, default=False)
    loan_amount = Column(String, nullable=True)
    loan_purpose = Column(String, nullable=True)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())

class ProfitRecord(Base):
    __tablename__ = "profit_records"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, index=True, nullable=False)
    crop = Column(String, nullable=False)
    type = Column(String, nullable=False)  # revenue or expense
    amount = Column(Float, nullable=False)
    note = Column(String, nullable=True)
    date = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())