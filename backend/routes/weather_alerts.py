from fastapi import APIRouter
from services.weather_service import get_weather, generate_alert

router = APIRouter()

@router.get("/smart-alerts/{city}")

def smart_alerts(city: str):

    weather_data = get_weather(city)

    alerts = generate_alert(weather_data)

    return {
        "city": city,
        "alerts": alerts,
        "weather": weather_data
    }