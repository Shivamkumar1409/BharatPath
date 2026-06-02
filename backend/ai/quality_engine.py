import cv2
import numpy as np

# =========================================================
# BHARATPATH IMAGE QUALITY ENGINE
# =========================================================

def analyze_image_quality(image_path):

    image = cv2.imread(image_path)

    gray = cv2.cvtColor(
        image,
        cv2.COLOR_BGR2GRAY
    )

    # =====================================================
    # BLUR DETECTION
    # =====================================================

    blur_score = cv2.Laplacian(
        gray,
        cv2.CV_64F
    ).var()

    # =====================================================
    # BRIGHTNESS DETECTION
    # =====================================================

    brightness = np.mean(gray)

    # =====================================================
    # QUALITY FLAGS
    # =====================================================

    quality_issues = []

    # BLUR CHECK
    if blur_score < 60:

        quality_issues.append(
            "⚠ Image appears blurry."
        )

    # DARK IMAGE CHECK
    if brightness < 50:

        quality_issues.append(
            "⚠ Image is too dark."
        )

    # OVEREXPOSED CHECK
    elif brightness > 220:

        quality_issues.append(
            "⚠ Image is overexposed."
        )

    # =====================================================
    # FINAL QUALITY STATUS
    # =====================================================

    is_good_quality = (
        len(quality_issues) == 0
    )

    return {

        "is_good_quality":
            is_good_quality,

        "blur_score":
            round(blur_score, 2),

        "brightness":
            round(brightness, 2),

        "issues":
            quality_issues
    }