from sqlalchemy.orm import Session
from models import Farmer
from schemas import FarmerCreate
from passlib.context import CryptContext

pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_farmer_by_email(db: Session, email: str):
    return db.query(Farmer).filter(Farmer.email == email).first()

def create_farmer(db: Session, farmer: FarmerCreate):
    hashed_password = pwd.hash(farmer.password)
    db_farmer = Farmer(
        name=farmer.name,
        email=farmer.email,
        password=hashed_password,
        location=farmer.location,
        farm_size=farmer.farm_size,
        crop_type=farmer.crop_type
    )
    db.add(db_farmer)
    db.commit()
    db.refresh(db_farmer)
    return db_farmer