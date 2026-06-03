# =========================================================
# BHARATPATH ADVANCED RISK ENGINE
# =========================================================

def generate_risk_analysis(
    health_condition,
    weather
):

    alerts = []

    recommendations = []

    humidity = weather["humidity"]

    temperature = weather["temperature"]

    wind_speed = weather["wind_speed"]

    # =====================================================
    # HIGH HUMIDITY ANALYSIS
    # =====================================================

    if humidity >= 80:

        alerts.append(
            "⚠ High humidity detected."
        )

        recommendations.append(
            "Avoid excessive irrigation."
        )

        recommendations.append(
            "Improve airflow around crops."
        )

        # COMBINED INTELLIGENCE
        if health_condition in [
            "Mild Stress",
            "Moderate Stress",
            "Severe Stress"
        ]:

            alerts.append(
                "🚨 Humid conditions may accelerate fungal spread."
            )

            recommendations.append(
                "Monitor lower leaves carefully."
            )

            recommendations.append(
                "Inspect crops within next 24 hours."
            )

    # =====================================================
    # LOW HUMIDITY
    # =====================================================

    elif humidity <= 30:

        alerts.append(
            "⚠ Low humidity detected."
        )

        recommendations.append(
            "Monitor dehydration symptoms."
        )

        recommendations.append(
            "Check soil moisture frequently."
        )

    # =====================================================
    # HIGH TEMPERATURE ANALYSIS
    # =====================================================

    if temperature >= 35:

        alerts.append(
            "⚠ High temperature stress possible."
        )

        recommendations.append(
            "Avoid irrigation during peak afternoon heat."
        )

        recommendations.append(
            "Inspect crops for heat damage."
        )

        # COMBINED HEAT + STRESS
        if health_condition in [
            "Moderate Stress",
            "Severe Stress"
        ]:

            alerts.append(
                "🚨 Existing crop stress may worsen under high temperature."
            )

            recommendations.append(
                "Prioritize immediate crop inspection."
            )

    # =====================================================
    # LOW TEMPERATURE
    # =====================================================

    elif temperature <= 10:

        alerts.append(
            "⚠ Low temperature may slow crop growth."
        )

    # =====================================================
    # WIND ANALYSIS
    # =====================================================

    if wind_speed >= 10:

        alerts.append(
            "⚠ Strong winds detected."
        )

        recommendations.append(
            "Monitor physical crop damage."
        )

        # WIND + STRESS
        if health_condition in [
            "Moderate Stress",
            "Severe Stress"
        ]:

            alerts.append(
                "⚠ Wind may increase disease spread risk."
            )

    # =====================================================
    # HEALTH CONDITION ANALYSIS
    # =====================================================

    if health_condition == "Healthy":

        alerts.append(
            "✅ Crop currently appears healthy."
        )

    elif health_condition == "Mild Stress":

        alerts.append(
            "⚠ Crop already under mild stress."
        )

    elif health_condition == "Moderate Stress":

        alerts.append(
            "🚨 Crop under moderate stress."
        )

        recommendations.append(
            "Inspect disease spread immediately."
        )

    elif health_condition == "Severe Stress":

        alerts.append(
            "🚨 Severe crop stress detected."
        )

        recommendations.append(
            "Immediate agricultural intervention required."
        )

        recommendations.append(
            "Consult agricultural specialist."
        )

    # =====================================================
    # REMOVE DUPLICATES
    # =====================================================

    alerts = list(set(alerts))

    recommendations = list(set(recommendations))

    # =====================================================
    # RETURN RESULTS
    # =====================================================

    return {

        "alerts":
            alerts,

        "recommendations":
            recommendations
    }