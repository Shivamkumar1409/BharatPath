from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
<<<<<<< HEAD
from database import engine, Base
import models
=======

from database import engine
from models import Base

from routes import auth, disease, mandi, profit, schemes, weather
>>>>>>> AI-CROP-HEALTH

Base.metadata.create_all(bind=engine)

from routes import auth, disease, mandi, profit, schemes, weather
from routes import profile

app = FastAPI(title="BharatPath API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

<<<<<<< HEAD
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(disease.router, prefix="/disease", tags=["disease"])
app.include_router(mandi.router, prefix="/mandi", tags=["mandi"])
app.include_router(profit.router, prefix="/profit", tags=["profit"])
app.include_router(schemes.router, prefix="/schemes", tags=["schemes"])
app.include_router(weather.router, prefix="/weather", tags=["weather"])
app.include_router(profile.router, prefix="/profile", tags=["profile"])

@app.get("/")
def root():
    return {"message": "BharatPath API running ✅"}
=======
app.include_router(
    auth.router,
    prefix="/auth",
    tags=["Authentication"]
)

app.include_router(
    disease.router,
    prefix="/crop-health",
    tags=["Crop Health AI"]
)

app.include_router(
    mandi.router,
    prefix="/mandi",
    tags=["Mandi Optimizer"]
)

app.include_router(
    profit.router,
    prefix="/profit",
    tags=["Profit Tracker"]
)

app.include_router(
    schemes.router,
    prefix="/schemes",
    tags=["Government Schemes"]
)

app.include_router(
    weather.router,
    prefix="/weather",
    tags=["Weather"]
)

@app.get("/")
def root():
    return {
        "message": "Bharat-Path API is running 🌾"
    }
>>>>>>> AI-CROP-HEALTH
