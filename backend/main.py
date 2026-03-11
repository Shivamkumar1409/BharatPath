from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine
from models import Base
from routes import auth, disease, mandi, profit, schemes

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Bharat-Path API",
    description="AI Decision Support System for Farmers",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(disease.router, prefix="/disease", tags=["Disease Detection"])
app.include_router(mandi.router, prefix="/mandi", tags=["Mandi Optimizer"])
app.include_router(profit.router, prefix="/profit", tags=["Profit Tracker"])
app.include_router(schemes.router, prefix="/schemes", tags=["Government Schemes"])

@app.get("/")
def root():
    return {"message": "Bharat-Path API is running 🌾"}