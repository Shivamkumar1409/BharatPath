from fastapi import APIRouter
import requests
import os
from dotenv import load_dotenv
from sklearn.linear_model import LinearRegression
import numpy as np

# Government MSP 2025-26 (₹ per quintal)
MSP_PRICES = {
    "Wheat": 2275,
    "Rice": 2300,
    "Maize": 2090,
    "Soyabean": 4892,
    "Cotton": 7121,
    "Mustard": 5950,
    "Sugarcane": 340,
    "Groundnut": 6783,
    "Sunflower": 7280,
    "Moong": 8682,
    "Urad": 7400,
    "Arhar": 7550,
    "Bajra": 2625,
    "Jowar": 3371,
    "Barley": 1735,
    "Onion": 0,
    "Tomato": 0,
    "Potato": 0,
}

load_dotenv()

router = APIRouter()

API_KEY = os.getenv("AGMARKNET_API_KEY")
BASE_URL = "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070"

def fetch_mandi_data(crop: str, limit: int = 100):
    params = {
        "api-key": API_KEY,
        "format": "json",
        "limit": limit,
        "filters[commodity]": crop.title(),
    }
    # Try 3 times with increasing timeout
    for attempt in range(3):
        try:
            timeout = 15 + (attempt * 10)  # 15s, 25s, 35s
            print(f"Attempt {attempt + 1} — timeout: {timeout}s")
            response = requests.get(BASE_URL, params=params, timeout=timeout)
            print(f"Status: {response.status_code}")
            if response.status_code == 200:
                data = response.json()
                records = data.get("records", [])
                print(f"Records found: {len(records)}")
                if records:
                    return records
        except requests.exceptions.Timeout:
            print(f"Attempt {attempt + 1} timed out, retrying...")
        except Exception as e:
            print(f"Error: {e}")
            break
    return []

@router.get("/best-mandi")
def get_best_mandi(crop: str, quantity: float, farmer_district: str = ""):
    records = fetch_mandi_data(crop)

    if not records:
        return {"error": f"Government API is slow right now. Please try again in a moment."}

    sorted_records = sorted(
        records,
        key=lambda x: float(x.get("modal_price", 0) or 0),
        reverse=True
    )

    seen = set()
    top_mandis = []
    for r in sorted_records:
        mandi = r.get("market", "") or r.get("Market", "")
        if mandi and mandi not in seen:
            seen.add(mandi)
            price = float(r.get("modal_price", 0) or r.get("Modal_Price", 0))
            revenue = price * (quantity / 100)
            top_mandis.append({
                "mandi": mandi,
                "price": price,
                "state": r.get("state", "") or r.get("State", ""),
                "district": r.get("district", "") or r.get("District", ""),
                "estimated_revenue": round(revenue, 2),
                "date": r.get("arrival_date", "") or r.get("Arrival_Date", ""),
            })
        if len(top_mandis) == 3:
            break

    if not top_mandis:
        return {"error": "Could not process mandi data. Please try again."}

    # Add MSP comparison to each mandi
    msp_price = MSP_PRICES.get(crop.title(), 0)
    for mandi in top_mandis:
        price = mandi["price"]
        if msp_price > 0:
            diff = price - msp_price
            diff_percent = round((diff / msp_price) * 100, 1)
            if price < msp_price:
                mandi["msp_alert"] = "below"
                mandi["msp_message"] = f"⚠️ Price is ₹{abs(diff)} BELOW MSP — Consider waiting to sell"
                mandi["msp_diff"] = diff
                mandi["msp_diff_percent"] = diff_percent
            elif price > msp_price * 1.1:
                mandi["msp_alert"] = "good"
                mandi["msp_message"] = f"✅ Excellent! Price is ₹{diff} ABOVE MSP — Great time to sell"
                mandi["msp_diff"] = diff
                mandi["msp_diff_percent"] = diff_percent
            else:
                mandi["msp_alert"] = "fair"
                mandi["msp_message"] = f"🟡 Fair price — ₹{diff} above MSP"
                mandi["msp_diff"] = diff
                mandi["msp_diff_percent"] = diff_percent
        else:
            mandi["msp_alert"] = "no_msp"
            mandi["msp_message"] = "ℹ️ No MSP set for this crop"
            mandi["msp_diff"] = 0
            mandi["msp_diff_percent"] = 0

    return {
        "recommendations": top_mandis,
        "crop": crop,
        "quantity": quantity,
        "msp_price": msp_price,
        "source": "data.gov.in - Ministry of Agriculture"
    }

@router.get("/price-prediction")
def predict_price(crop: str):
    records = fetch_mandi_data(crop, limit=50)

    if len(records) < 3:
        return {"error": "Not enough data for prediction. Please try again."}

    prices = []
    for r in records:
        try:
            price = float(r.get("modal_price", 0) or r.get("Modal_Price", 0))
            if price > 0:
                prices.append(price)
        except:
            continue

    if len(prices) < 3:
        return {"error": "Not enough valid price data"}

    X = np.arange(len(prices)).reshape(-1, 1)
    y = np.array(prices)
    model = LinearRegression().fit(X, y)
    next_price = model.predict([[len(prices)]])[0]
    trend = "increasing 📈" if model.coef_[0] > 0 else "decreasing 📉"
    avg_price = round(sum(prices) / len(prices), 2)

    return {
        "crop": crop,
        "predicted_price": round(next_price, 2),
        "trend": trend,
        "average_price": avg_price,
        "data_points": len(prices),
        "source": "data.gov.in - Ministry of Agriculture"
    }

@router.get("/test")
def mandi_test():
    return {"message": "Mandi route working ✅"}

@router.get("/msp-prices")
def get_msp_prices():
    return {
        "msp_prices": MSP_PRICES,
        "year": "2025-26",
        "source": "Ministry of Agriculture, Government of India",
        "note": "MSP prices in ₹ per quintal"
    }

@router.get("/msp-check")
def check_msp(crop: str, current_price: float):
    msp = MSP_PRICES.get(crop.title(), 0)
    if msp == 0:
        return {
            "crop": crop,
            "current_price": current_price,
            "msp": 0,
            "alert": "no_msp",
            "message": "No MSP set for this crop by Government of India"
        }

    diff = current_price - msp
    diff_percent = round((diff / msp) * 100, 1)

    if current_price < msp:
        alert = "below"
        recommendation = "🔴 DO NOT SELL — Current price is below MSP. Wait for better prices or sell through government procurement."
    elif current_price >= msp * 1.15:
        alert = "excellent"
        recommendation = "🟢 EXCELLENT TIME TO SELL — Price is significantly above MSP. Sell now for maximum profit."
    elif current_price >= msp:
        alert = "good"
        recommendation = "🟡 GOOD TIME TO SELL — Price is at or above MSP. Reasonable to sell now."
    else:
        alert = "fair"
        recommendation = "🟡 FAIR — Price is close to MSP."

    return {
        "crop": crop,
        "current_price": current_price,
        "msp": msp,
        "difference": diff,
        "difference_percent": diff_percent,
        "alert": alert,
        "recommendation": recommendation,
        "year": "2025-26"
    }