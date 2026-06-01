import requests
import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("WEATHER_API_KEY")


def get_weather(city="Delhi"):

    url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric"

    response = requests.get(url)

    data = response.json()

    print("Weather API Response:", data)

    return data


def generate_alert(weather_data):

    # HANDLE API ERRORS
    if "main" not in weather_data:

        return [
            f"⚠️ Weather API Error: {weather_data.get('message', 'Unknown error')}"
        ]

    temp = weather_data["main"]["temp"]

    humidity = weather_data["main"]["humidity"]

    weather = weather_data["weather"][0]["main"]

    alerts = []

    if temp > 38:
        alerts.append("🔥 Extreme heat detected. Increase irrigation.")

    if humidity > 85:
        alerts.append("🌫️ High humidity may cause fungal diseases.")

    if weather == "Rain":
        alerts.append("🌧️ Rain expected. Avoid pesticide spraying.")

    if weather == "Thunderstorm":
        alerts.append("⛈️ Thunderstorm expected. Avoid field work.")

    if len(alerts) == 0:
        alerts.append("✅ Weather conditions look normal for farming.")

    return alerts