from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from database import Base
import datetime

class Farmer(Base):
    __tablename__ = "farmers"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    email = Column(String(100), unique=True, index=True)
    password = Column(String(200))
    location = Column(String(100))
    farm_size = Column(Float, nullable=True)
    crop_type = Column(String(100), nullable=True)

class DiseaseRecord(Base):
    __tablename__ = "disease_records"
    id = Column(Integer, primary_key=True, index=True)
    farmer_id = Column(Integer)
    disease_name = Column(String(200))
    confidence = Column(Float)
    treatment = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class ProfitRecord(Base):
    __tablename__ = "profit_records"
    id = Column(Integer, primary_key=True, index=True)
    farmer_id = Column(Integer)
    expense = Column(Float)
    revenue = Column(Float)
    crop = Column(String(100))
    date = Column(DateTime, default=datetime.datetime.utcnow)