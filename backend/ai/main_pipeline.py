from .validator import validate_leaf_image
from .quality_engine import analyze_image_quality
from .predictor import predict_crop_health
from .weather_engine import get_weather
from .risk_engine import generate_risk_analysis
from .recommendation_engine import organize_recommendations

# =========================================================
# TEST INPUTS
# =========================================================

image_path = "test_images/leaf.jpg"

farmer_city = "Patna"

# =========================================================
# STEP 1 — VALIDATE IMAGE
# =========================================================

is_leaf = validate_leaf_image(image_path)

if not is_leaf:

    print("\n❌ Invalid image detected.")
    print("Please upload a crop leaf image.")

    exit()

# =========================================================
# STEP 2 — IMAGE QUALITY ANALYSIS
# =========================================================

quality = analyze_image_quality(image_path)

if not quality["is_good_quality"]:

    print("\n⚠ Image Quality Issues Detected:\n")

    for issue in quality["issues"]:

        print(issue)

    print(
        "\nPlease upload a clearer crop image."
    )

    exit()

# =========================================================
# STEP 3 — CROP HEALTH PREDICTION
# =========================================================

result = predict_crop_health(image_path)

# =========================================================
# STEP 4 — WEATHER DATA
# =========================================================

weather = get_weather(farmer_city)

# =========================================================
# TESTING DANGEROUS CONDITIONS
# REMOVE LATER IN PRODUCTION
# =========================================================

#weather["humidity"] = 88

#weather["temperature"] = 37

#weather["wind_speed"] = 12  

# =========================================================
# STEP 5 — RISK ANALYSIS
# =========================================================

risk_data = generate_risk_analysis(
    result["health_condition"],
    weather
)

# =========================================================
# STEP 6 — SMART RECOMMENDATIONS
# =========================================================

all_recommendations = (

    result["recommendations"]

    +

    risk_data["recommendations"]
)

organized = organize_recommendations(

    all_recommendations,

    risk_data["alerts"]
)

# =========================================================
# FINAL OUTPUT
# =========================================================

print("\n====== BharatPath AI v3 ======\n")

print(
    f"Farmer Location : "
    f"{weather['city']}"
)

print(
    f"Health Condition : "
    f"{result['health_condition']}"
)

print(
    f"Health Score     : "
    f"{result['health_score']}/100"
)

print(
    f"Confidence       : "
    f"{result['confidence']}%"
)

print(
    f"Confidence Level : "
    f"{result['confidence_level']}"
)

print(
    f"AI Confidence    : "
    f"{result['confidence_message']}"
)

print(
    f"Temperature      : "
    f"{weather['temperature']}°C"
)

print(
    f"Humidity         : "
    f"{weather['humidity']}%"
)

print(
    f"Weather          : "
    f"{weather['condition']}"
)

print(
    f"Wind Speed       : "
    f"{weather['wind_speed']} m/s"
)

print(
    f"Blur Score       : "
    f"{quality['blur_score']}"
)

print(
    f"Brightness       : "
    f"{quality['brightness']}"
)

print("\nAlerts:")

for alert in risk_data["alerts"]:

    print(f"  {alert}")

print("\nRecommendations:")

# =====================================================
# HIGH PRIORITY
# =====================================================

if organized["high_priority"]:

    print("\nHIGH PRIORITY ACTIONS:")

    for rec in organized["high_priority"]:

        print(f"  → {rec}")

# =====================================================
# PREVENTIVE
# =====================================================

if organized["preventive"]:

    print("\nPREVENTIVE ACTIONS:")

    for rec in organized["preventive"]:

        print(f"  → {rec}")

# =====================================================
# MONITORING
# =====================================================

if organized["monitoring"]:

    print("\nMONITORING ACTIONS:")

    for rec in organized["monitoring"]:

        print(f"  → {rec}")

print("\n==============================")