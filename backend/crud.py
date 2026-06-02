from sqlalchemy.orm import Session
from models import Farmer
from schemas import FarmerCreate
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

def get_farmer_by_email(db: Session, email: str):
    return db.query(Farmer).filter(Farmer.email == email).first()

def create_farmer(db: Session, farmer: FarmerCreate):
    hashed = hash_password(farmer.password)
    db_farmer = Farmer(
        name=farmer.name,
        email=farmer.email,
        hashed_password=hashed,
        is_verified=False
    )
    db.add(db_farmer)
    db.commit()
    db.refresh(db_farmer)
    return db_farmer