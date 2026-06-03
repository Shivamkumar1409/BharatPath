# =========================================================
# BHARATPATH SMART RECOMMENDATION ENGINE
# =========================================================

def organize_recommendations(
    recommendations,
    alerts
):

    # =====================================================
    # SEMANTIC DEDUPLICATION
    # =====================================================

    cleaned_recommendations = []

    duplicate_groups = {

        "watering": [
            "avoid excessive watering",
            "avoid excessive irrigation"
        ],

        "inspection": [
            "inspect crops within next 24 hours",
            "inspect affected plants immediately"
        ]
    }

    seen_groups = set()

    for rec in recommendations:

        lower = rec.lower().strip().replace(".", "")

        matched = False

        for group_name, phrases in duplicate_groups.items():

            if lower in phrases:

                if group_name not in seen_groups:

                    cleaned_recommendations.append(rec)

                    seen_groups.add(group_name)

                matched = True

                break

        if not matched:

            cleaned_recommendations.append(rec)

    recommendations = cleaned_recommendations

    # =====================================================
    # PRIORITY GROUPS
    # =====================================================

    high_priority = []

    preventive = []

    monitoring = []

    # =====================================================
    # CLASSIFY RECOMMENDATIONS
    # =====================================================

    for rec in recommendations:

        lower = rec.lower()

        # HIGH PRIORITY
        if any(keyword in lower for keyword in [

            "immediate",
            "within next 24 hours",
            "consult",
            "intervention",
            "inspect affected",
            "prioritize"

        ]):

            high_priority.append(rec)

        # PREVENTIVE
        elif any(keyword in lower for keyword in [

            "avoid",
            "improve",
            "reduce",
            "increase airflow",
            "fungicide"

        ]):

            preventive.append(rec)

        # MONITORING
        else:

            monitoring.append(rec)

    # =====================================================
    # RETURN ORGANIZED OUTPUT
    # =====================================================

    return {

        "high_priority":
            high_priority,

        "preventive":
            preventive,

        "monitoring":
            monitoring
    }