from fastapi import APIRouter
import requests
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()
WEATHER_API_KEY = os.getenv("WEATHER_API_KEY")

@router.get("/current")
def get_weather(city: str = "Delhi"):
    try:
        url = f"https://api.openweathermap.org/data/2.5/weather"
        params = {
            "q": f"{city},IN",
            "appid": WEATHER_API_KEY,
            "units": "metric"
        }
        response = requests.get(url, params=params, timeout=10)
        data = response.json()

        if response.status_code != 200:
            return {"error": "City not found. Please try another city."}

        return {
            "city": data["name"],
            "state": data.get("sys", {}).get("country", "IN"),
            "temperature": round(data["main"]["temp"]),
            "feels_like": round(data["main"]["feels_like"]),
            "humidity": data["main"]["humidity"],
            "description": data["weather"][0]["description"].title(),
            "icon": data["weather"][0]["icon"],
            "wind_speed": data["wind"]["speed"],
            "visibility": data.get("visibility", 0) // 1000,
            "farming_advice": get_farming_advice(
                data["weather"][0]["main"],
                data["main"]["temp"],
                data["main"]["humidity"]
            )
        }
    except Exception as e:
        return {"error": str(e)}

def get_farming_advice(condition: str, temp: float, humidity: int) -> str:
    condition = condition.lower()
    if "rain" in condition:
        return "🌧️ Rain expected — avoid spraying pesticides. Good time for irrigation-free farming."
    elif "clear" in condition and temp > 35:
        return "☀️ Very hot day — water your crops early morning or evening. Avoid afternoon irrigation."
    elif "clear" in condition and temp < 15:
        return "❄️ Cold weather — protect sensitive crops from frost. Good time for Rabi crops."
    elif "cloud" in condition:
        return "⛅ Cloudy weather — good conditions for spraying fertilizers and pesticides."
    elif "thunderstorm" in condition:
        return "⛈️ Thunderstorm warning — secure your farm equipment and avoid outdoor work."
    elif humidity > 80:
        return "💧 High humidity — watch out for fungal diseases. Ensure proper crop ventilation."
    elif humidity < 30:
        return "🌵 Low humidity — increase irrigation frequency to prevent crop stress."
    else:
        return "🌾 Normal weather conditions — continue regular farming activities."

@router.get("/forecast")
def get_forecast(city: str = "Delhi"):
    try:
        url = "https://api.openweathermap.org/data/2.5/forecast"
        params = {
            "q": f"{city},IN",
            "appid": WEATHER_API_KEY,
            "units": "metric",
            "cnt": 5
        }
        response = requests.get(url, params=params, timeout=10)
        data = response.json()

        if response.status_code != 200:
            return {"error": "City not found"}

        forecasts = []
        for item in data["list"][:5]:
            forecasts.append({
                "time": item["dt_txt"],
                "temp": round(item["main"]["temp"]),
                "description": item["weather"][0]["description"].title(),
                "icon": item["weather"][0]["icon"],
                "humidity": item["main"]["humidity"],
            })

        return {"city": city, "forecasts": forecasts}
    except Exception as e:
        return {"error": str(e)}