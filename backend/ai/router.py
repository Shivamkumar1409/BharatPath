from fastapi import APIRouter, File, UploadFile, Form
from fastapi.responses import JSONResponse
import io
import os
import numpy as np
from PIL import Image
from dotenv import load_dotenv

from .validator import validate_leaf_image
from .quality_engine import analyze_image_quality
from .predictor import predict_crop_health
from .weather_engine import get_weather
from .risk_engine import generate_risk_analysis
from .recommendation_engine import organize_recommendations

load_dotenv()

router = APIRouter(
    tags=["Crop Health AI"]
)

def save_temp_image(image_bytes: bytes) -> str:
    """Save uploaded bytes to temp file for processing"""
    temp_path = os.path.join(
    os.getcwd(),
    "bharatpath_upload.jpg"
)
    with open(temp_path, "wb") as f:
        f.write(image_bytes)
    return temp_path

@router.get("/")
def crop_health_info():
    return {
        "module": "BharatPath Crop Health AI",
        "version": "v3",
        "status": "running"
    }

@router.post("/predict")
async def predict(
    image: UploadFile = File(...),
    city: str = Form(None)
):
    image_bytes = await image.read()
    temp_path = save_temp_image(image_bytes)

    # Step 1 — Validate
    is_leaf = validate_leaf_image(temp_path)
    if not is_leaf:
        return JSONResponse(status_code=400, content={
            "success": False,
            "valid_image": False,
            "error": "Invalid image. Please upload a crop or plant leaf photo.",
            "message": "BharatPath only analyzes plant and crop images."
        })

    # Step 2 — Quality check
    quality = analyze_image_quality(temp_path)
    if not quality["is_good_quality"]:
        return JSONResponse(status_code=400, content={
            "success": False,
            "valid_image": True,
            "good_quality": False,
            "error": "Poor image quality detected.",
            "issues": quality["issues"],
            "blur_score": quality["blur_score"],
            "brightness": quality["brightness"]
        })

    # Step 3 — Predict
    result = predict_crop_health(temp_path)

    # Step 4 — Weather
    weather = None
    farmer_city = city or "Delhi"
    try:
        weather = get_weather(farmer_city)
    except Exception:
        weather = {
            "city": farmer_city,
            "temperature": 28,
            "humidity": 60,
            "condition": "unavailable",
            "wind_speed": 5
        }

    # Step 5 — Risk analysis
    risk_data = generate_risk_analysis(
        result["health_condition"],
        weather
    )

    # Step 6 — Recommendations
    all_recommendations = (
        result["recommendations"] +
        risk_data["recommendations"]
    )
    organized = organize_recommendations(
        all_recommendations,
        risk_data["alerts"]
    )

    return {
        "success": True,
        "valid_image": True,
        "good_quality": True,

        # Health
        "health_condition": result["health_condition"],
        "health_score": result["health_score"],
        "confidence_percent": result["confidence"],
        "confidence_level": result["confidence_level"],
        "confidence_message": result["confidence_message"],
        "risk_level": result["risk_level"],

        # Image quality
        "image_quality": {
            "blur_score": quality["blur_score"],
            "brightness": quality["brightness"]
        },

        # Weather
        "weather": {
            "city": weather["city"],
            "temperature": weather["temperature"],
            "humidity": weather["humidity"],
            "condition": weather["condition"],
            "wind_speed": weather["wind_speed"]
        },

        # Alerts
        "alerts": risk_data["alerts"],

        # Recommendations organized
        "recommendations": {
            "high_priority": organized["high_priority"],
            "preventive": organized["preventive"],
            "monitoring": organized["monitoring"]
        }
    }