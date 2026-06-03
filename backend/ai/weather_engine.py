import requests

# =========================================================
# BHARATPATH WEATHER ENGINE
# =========================================================

import os
from dotenv import load_dotenv
load_dotenv()
API_KEY = os.getenv("WEATHER_API_KEY")

DEBUG = False

# =========================================================
# GET WEATHER DATA
# =========================================================

def get_weather(city):

    url = (
        f"https://api.openweathermap.org/data/2.5/weather"
        f"?q={city}"
        f"&appid={API_KEY}"
        f"&units=metric"
    )

    response = requests.get(url)

    data = response.json()

    # DEBUG MODE
    if DEBUG:

        print("\nRAW WEATHER DATA:\n")

        print(data)

    # WEATHER OUTPUT
    weather_data = {

        "city":
            data["name"],

        "temperature":
            data["main"]["temp"],

        "humidity":
            data["main"]["humidity"],

        "condition":
            data["weather"][0]["description"],

        "wind_speed":
            data["wind"]["speed"]
    }

    return weather_data