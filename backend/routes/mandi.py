from fastapi import APIRouter
import requests
import os
from dotenv import load_dotenv
from sklearn.linear_model import LinearRegression
import numpy as np
import time

load_dotenv()

router = APIRouter()

API_KEY = os.getenv("AGMARKNET_API_KEY")
BASE_URL = "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070"

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

# ─── In-memory cache ───────────────────────────────────────────
_cache = {}          # { crop_key: {"data": [...], "ts": timestamp} }
CACHE_TTL = 6 * 3600  # 6 hours

def _cache_get(key: str):
    entry = _cache.get(key)
    if entry and (time.time() - entry["ts"]) < CACHE_TTL:
        print(f"Cache HIT for {key}")
        return entry["data"]
    return None

def _cache_set(key: str, data: list):
    _cache[key] = {"data": data, "ts": time.time()}
# ───────────────────────────────────────────────────────────────

def fetch_mandi_data(crop: str, limit: int = 100):
    cache_key = f"{crop.lower()}_{limit}"
    cached = _cache_get(cache_key)
    if cached:
        return cached

    params = {
        "api-key": API_KEY,
        "format": "json",
        "limit": limit,
        "filters[commodity]": crop.title(),
    }

    for attempt in range(3):
        try:
            timeout = 20 + attempt * 15   # 20s, 35s, 50s
            print(f"[{crop}] Attempt {attempt+1}, timeout={timeout}s")
            resp = requests.get(BASE_URL, params=params, timeout=timeout)
            if resp.status_code == 200:
                records = resp.json().get("records", [])
                if records:
                    _cache_set(cache_key, records)
                    print(f"[{crop}] Got {len(records)} records, cached.")
                    return records
        except requests.exceptions.Timeout:
            print(f"[{crop}] Attempt {attempt+1} timed out.")
        except Exception as e:
            print(f"[{crop}] Error: {e}")
            break

    # Return stale cache if available (even expired)
    stale = _cache.get(cache_key)
    if stale:
        print(f"[{crop}] Returning stale cache.")
        return stale["data"]

    return []


def add_msp_info(mandi: dict, crop: str):
    msp_price = MSP_PRICES.get(crop.title(), 0)
    price = mandi.get("price", 0)
    if msp_price > 0:
        diff = round(price - msp_price, 2)
        diff_pct = round((diff / msp_price) * 100, 1)
        if price < msp_price:
            alert, msg = "below", f"⚠️ Price is ₹{abs(diff)} BELOW MSP — Consider waiting or selling to govt procurement"
        elif price > msp_price * 1.1:
            alert, msg = "good", f"✅ Excellent! Price is ₹{diff} ABOVE MSP — Great time to sell"
        else:
            alert, msg = "fair", f"🟡 Fair price — ₹{diff} above MSP"
    else:
        diff, diff_pct, alert, msg = 0, 0, "no_msp", "ℹ️ No MSP set for this crop"

    mandi.update({
        "msp_alert": alert,
        "msp_message": msg,
        "msp_diff": diff,
        "msp_diff_percent": diff_pct,
    })
    return mandi


@router.get("/best-mandi")
def get_best_mandi(crop: str, quantity: float, farmer_district: str = ""):
    records = fetch_mandi_data(crop)

    if not records:
        return {
            "error": f"Could not fetch live data for {crop} right now. The government API may be temporarily slow. Please try again in a few minutes.",
            "recommendations": [],
            "crop": crop,
            "quantity": quantity,
            "msp_price": MSP_PRICES.get(crop.title(), 0),
            "source": "data.gov.in - Ministry of Agriculture"
        }

    sorted_records = sorted(
        records,
        key=lambda x: float(x.get("modal_price", 0) or 0),
        reverse=True
    )

    seen, top_mandis = set(), []
    for r in sorted_records:
        mandi_name = r.get("market") or r.get("Market", "")
        if not mandi_name or mandi_name in seen:
            continue
        seen.add(mandi_name)
        price = float(r.get("modal_price", 0) or r.get("Modal_Price", 0))
        revenue = round(price * (quantity / 100), 2)
        mandi = {
            "mandi": mandi_name,
            "price": price,
            "state": r.get("state") or r.get("State", ""),
            "district": r.get("district") or r.get("District", ""),
            "estimated_revenue": revenue,
            "date": r.get("arrival_date") or r.get("Arrival_Date", ""),
        }
        add_msp_info(mandi, crop)
        top_mandis.append(mandi)
        if len(top_mandis) == 3:
            break

    return {
        "recommendations": top_mandis,
        "crop": crop,
        "quantity": quantity,
        "msp_price": MSP_PRICES.get(crop.title(), 0),
        "source": "data.gov.in - Ministry of Agriculture"
    }


@router.get("/price-prediction")
def predict_price(crop: str):
    records = fetch_mandi_data(crop, limit=50)

    if len(records) < 3:
        return {"error": "Not enough data for prediction. Please try again later."}

    prices = []
    for r in records:
        try:
            p = float(r.get("modal_price", 0) or r.get("Modal_Price", 0))
            if p > 0:
                prices.append(p)
        except:
            continue

    if len(prices) < 3:
        return {"error": "Not enough valid price data."}

    X = np.arange(len(prices)).reshape(-1, 1)
    y = np.array(prices)
    model = LinearRegression().fit(X, y)
    next_price = model.predict([[len(prices)]])[0]
    trend = "increasing 📈" if model.coef_[0] > 0 else "decreasing 📉"

    return {
        "crop": crop,
        "predicted_price": round(next_price, 2),
        "trend": trend,
        "average_price": round(sum(prices) / len(prices), 2),
        "data_points": len(prices),
        "source": "data.gov.in - Ministry of Agriculture"
    }


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
        return {"crop": crop, "current_price": current_price, "msp": 0,
                "alert": "no_msp", "message": "No MSP set for this crop"}

    diff = round(current_price - msp, 2)
    diff_pct = round((diff / msp) * 100, 1)

    if current_price < msp:
        alert = "below"
        rec = "🔴 DO NOT SELL — Price is below MSP. Sell through government procurement instead."
    elif current_price >= msp * 1.15:
        alert = "excellent"
        rec = "🟢 EXCELLENT — Price is significantly above MSP. Sell now for maximum profit."
    else:
        alert = "good"
        rec = "🟡 GOOD — Price is at or above MSP. Reasonable to sell now."

    return {
        "crop": crop, "current_price": current_price, "msp": msp,
        "difference": diff, "difference_percent": diff_pct,
        "alert": alert, "recommendation": rec, "year": "2025-26"
    }


@router.get("/cache-status")
def cache_status():
    """Check what's currently cached"""
    return {
        "cached_crops": list(_cache.keys()),
        "cache_count": len(_cache)
    }


@router.get("/test")
def mandi_test():
    return {"message": "Mandi route working ✅"}