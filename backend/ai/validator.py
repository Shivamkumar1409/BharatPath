from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.applications.mobilenet_v2 import (
    preprocess_input,
    decode_predictions
)

import numpy as np
from PIL import Image

# =========================================================
# LOAD VALIDATION MODEL
# =========================================================

print("Loading validator model...")

validator_model = MobileNetV2(
    weights="imagenet"
)

print("Validator model loaded ✅")

# =========================================================
# VALIDATION FUNCTION
# =========================================================

def validate_leaf_image(image_path):

    # LOAD IMAGE
    img = Image.open(image_path).convert("RGB")

    # RESIZE
    img = img.resize((224, 224))

    # CONVERT TO ARRAY
    img_array = np.array(img)

    # ADD BATCH DIMENSION
    img_array = np.expand_dims(
        img_array,
        axis=0
    )

    # PREPROCESS
    img_array = preprocess_input(img_array)

    # PREDICT
    preds = validator_model.predict(
        img_array,
        verbose=0
    )

    decoded = decode_predictions(
        preds,
        top=5
    )[0]

    

    # =====================================================
    # PLANT KEYWORDS
    # =====================================================

    plant_keywords = [

        "leaf",
        "plant",
        "tree",
        "flower",
        "corn",
        "fungus",
        "fruit",
        "mushroom",
        "daisy",
        "sunflower"

    ]

    # =====================================================
    # VALIDATION LOGIC
    # =====================================================

    for _, label, score in decoded:

        if any(
            keyword in label.lower()
            for keyword in plant_keywords
        ):

            return True

    return False