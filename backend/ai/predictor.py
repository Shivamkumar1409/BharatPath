import tensorflow as tf
import numpy as np
from PIL import Image
import os

# =========================================================
# BHARATPATH AI v3 — CROP HEALTH PREDICTOR
# =========================================================

# =========================================================
# LOAD MODEL
# =========================================================

BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)

MODEL_PATH = os.path.abspath(
    os.path.join(
        BASE_DIR,
        "..",
        "models",
        "bharatpath_v3_final.keras"
    )
)

print("Loading BharatPath model...")

model = tf.keras.models.load_model(MODEL_PATH)

print("BharatPath model loaded ✅")

# =========================================================
# CONFIG
# =========================================================

IMG_SIZE = 160

# CLASS LABELS
CLASSES = {
    0: "Healthy",
    1: "Mild Stress",
    2: "Moderate Stress",
    3: "Severe Stress"
}

# BASE HEALTH SCORES
HEALTH_SCORES = {
    0: 90,
    1: 72,
    2: 48,
    3: 20
}

# =========================================================
# IMAGE PREPROCESSING
# =========================================================

def preprocess_image(image_path):

    # LOAD IMAGE
    img = Image.open(image_path).convert("RGB")

    # RESIZE
    img = img.resize((IMG_SIZE, IMG_SIZE))

    # CONVERT TO ARRAY
    img_array = np.array(
        img,
        dtype=np.float32
    )

    # ADD BATCH DIMENSION
    img_array = np.expand_dims(
        img_array,
        axis=0
    )

    return img_array

# =========================================================
# ALERT + RECOMMENDATION ENGINE
# =========================================================

def generate_alerts_and_recommendations(
    health_class,
    confidence
):

    alerts = []

    recommendations = []

    # =====================================================
    # HEALTHY
    # =====================================================

    if health_class == 0:

        alerts.append(
            "✅ Crop looks healthy."
        )

        recommendations.append(
            "Continue current farming practices."
        )

        recommendations.append(
            "Monitor crop weekly for early stress signs."
        )

        recommendations.append(
            "Maintain balanced irrigation schedule."
        )

    # =====================================================
    # MILD STRESS
    # =====================================================

    elif health_class == 1:

        alerts.append(
            "⚠ Mild stress detected in crop."
        )

        recommendations.append(
            "Check soil moisture levels."
        )

        recommendations.append(
            "Inspect leaves for early fungal or pest symptoms."
        )

        recommendations.append(
            "Avoid excessive watering."
        )

        recommendations.append(
            "Use light foliar spray if symptoms continue."
        )

    # =====================================================
    # MODERATE STRESS
    # =====================================================

    elif health_class == 2:

        alerts.append(
            "🚨 Moderate crop stress detected."
        )

        recommendations.append(
            "Inspect affected plants immediately."
        )

        recommendations.append(
            "Check for fungal, mold, or bacterial spread."
        )

        recommendations.append(
            "Reduce excess irrigation."
        )

        recommendations.append(
            "Consider fungicide treatment if necessary."
        )

        recommendations.append(
            "Isolate infected leaves if spread increases."
        )

    # =====================================================
    # SEVERE STRESS
    # =====================================================

    else:

        alerts.append(
            "🚨 Severe crop stress detected."
        )

        recommendations.append(
            "Immediate agricultural intervention required."
        )

        recommendations.append(
            "Consult agricultural specialist."
        )

        recommendations.append(
            "Remove heavily infected leaves or plants."
        )

        recommendations.append(
            "Monitor nearby crops carefully."
        )

    return alerts, recommendations

# =========================================================
# MAIN PREDICTION FUNCTION
# =========================================================

def predict_crop_health(image_path):

    # =====================================================
    # PREPROCESS IMAGE
    # =====================================================

    img = preprocess_image(image_path)

    # =====================================================
    # MODEL PREDICTION
    # =====================================================

    predictions = model.predict(
        img,
        verbose=0
    )

    predicted_class = int(
        np.argmax(predictions[0])
    )

    confidence = float(
        np.max(predictions[0])
    )

    # =====================================================
    # HEALTH CONDITION
    # =====================================================

    condition = CLASSES[predicted_class]

    # =====================================================
    # HEALTH SCORE
    # =====================================================

    base_score = HEALTH_SCORES[predicted_class]

    health_score = round(
        base_score * confidence
        +
        base_score * (1 - confidence) * 0.85
    )

    # =====================================================
    # ALERTS + RECOMMENDATIONS
    # =====================================================

    alerts, recommendations = (
        generate_alerts_and_recommendations(
            predicted_class,
            confidence
        )
    )

    # =====================================================
    # RISK LEVEL
    # =====================================================

    if predicted_class == 0:

        risk = "Low"

    elif predicted_class == 1:

        risk = "Medium"

    else:

        risk = "High"

    # =====================================================
    # CONFIDENCE INTERPRETATION
    # =====================================================

    if confidence >= 0.90:

        confidence_level = "High"

        confidence_message = (
            "Prediction confidence is strong."
        )

    elif confidence >= 0.70:

        confidence_level = "Moderate"

        confidence_message = (
            "Prediction confidence is acceptable."
        )

    elif confidence >= 0.50:

        confidence_level = "Low"

        confidence_message = (
            "Prediction uncertainty detected."
        )

    else:

        confidence_level = "Very Low"

        confidence_message = (
            "Please upload a clearer crop image."
        )

    # =====================================================
    # RETURN FINAL RESULTS
    # =====================================================

    return {

        "health_condition":
            condition,

        "health_score":
            health_score,

        "confidence":
            round(confidence * 100, 1),

        "confidence_level":
            confidence_level,

        "confidence_message":
            confidence_message,

        "risk_level":
            risk,

        "alerts":
            alerts,

        "recommendations":
            recommendations
    }