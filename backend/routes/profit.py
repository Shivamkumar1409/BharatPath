from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import ProfitRecord
from pydantic import BaseModel
from typing import Optional
from datetime import date as date_type

router = APIRouter()

class ProfitRecordCreate(BaseModel):
    email: str
    crop: str
    type: str
    amount: float
    note: Optional[str] = ""
    date: Optional[str] = None

@router.post("/add")
def add_record(data: ProfitRecordCreate, db: Session = Depends(get_db)):
    try:
        record_date = data.date or str(date_type.today())
        new_record = ProfitRecord(
            email=data.email,
            crop=data.crop,
            type=data.type,
            amount=data.amount,
            note=data.note or "",
            date=record_date,
        )
        db.add(new_record)
        db.commit()
        db.refresh(new_record)
        return {
            "message": "Record saved ✅",
            "id": new_record.id,
            "record": {
                "id": new_record.id,
                "crop": new_record.crop,
                "type": new_record.type,
                "amount": new_record.amount,
                "note": new_record.note,
                "date": new_record.date,
            }
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/get/{email}")
def get_records(email: str, db: Session = Depends(get_db)):
    try:
        records = db.query(ProfitRecord)\
            .filter(ProfitRecord.email == email)\
            .order_by(ProfitRecord.id.desc())\
            .all()
        return {
            "records": [
                {
                    "id": r.id,
                    "crop": r.crop,
                    "type": r.type,
                    "amount": float(r.amount),
                    "note": r.note,
                    "date": r.date,
                }
                for r in records
            ],
            "count": len(records)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/delete/{record_id}")
def delete_record(record_id: int, db: Session = Depends(get_db)):
    try:
        record = db.query(ProfitRecord)\
            .filter(ProfitRecord.id == record_id)\
            .first()
        if not record:
            raise HTTPException(status_code=404, detail="Record not found")
        db.delete(record)
        db.commit()
        return {"message": "Record deleted ✅"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/test")
def test():
    return {"message": "Profit route working ✅"}