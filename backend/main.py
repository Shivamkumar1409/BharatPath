from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
import models  # 💡 Fixed: removed 'backend.'
from routes import auth, disease, mandi, profit, schemes, weather, profile  # 💡 Fixed: removed 'backend.'

app = FastAPI(title="BharatPath API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(disease.router, prefix="/disease", tags=["disease"])
app.include_router(mandi.router, prefix="/mandi", tags=["mandi"])
app.include_router(profit.router, prefix="/profit", tags=["profit"])
app.include_router(schemes.router, prefix="/schemes", tags=["schemes"])
app.include_router(weather.router, prefix="/weather", tags=["weather"])
app.include_router(profile.router, prefix="/profile", tags=["profile"])

# Weather alerts route
try:
    from routes import weather_alerts
    app.include_router(weather_alerts.router, prefix="/weather-alerts", tags=["weather-alerts"])
    print("✅ Weather alerts route registered")
except Exception as e:
    print(f"⚠️ Weather alerts route skipped: {e}")

@app.get("/")
def root():
    return {"message": "BharatPath API running ✅"}