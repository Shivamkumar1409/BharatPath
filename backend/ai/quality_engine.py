import cv2
import numpy as np

def analyze_image_quality(image_path):

    image = cv2.imread(image_path)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    blur_score = cv2.Laplacian(gray, cv2.CV_64F).var()
    brightness = np.mean(gray)

    quality_issues = []

    # Lowered from 60 → 30 (outdoor crop photos score lower naturally)
    if blur_score < 30:
        quality_issues.append(
            "⚠ Image appears too blurry. Hold camera steady and retake."
        )

    # Lowered from 50 → 35
    if brightness < 35:
        quality_issues.append(
            "⚠ Image is too dark. Take photo in natural daylight."
        )

    # Raised from 220 → 230
    elif brightness > 230:
        quality_issues.append(
            "⚠ Image is overexposed. Avoid direct harsh sunlight on leaf."
        )

    h, w = image.shape[:2]
    if h < 80 or w < 80:
        quality_issues.append(
            "⚠ Image resolution too low. Use a clearer, closer photo."
        )

    return {
        "is_good_quality": len(quality_issues) == 0,
        "blur_score":      round(blur_score, 2),
        "brightness":      round(brightness, 2),
        "resolution":      f"{w}x{h}",
        "issues":          quality_issues
    }