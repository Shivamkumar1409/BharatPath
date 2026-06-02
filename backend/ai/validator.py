from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.applications.mobilenet_v2 import (
    preprocess_input,
    decode_predictions
)
import numpy as np
from PIL import Image

print("Loading validator model...")
validator_model = MobileNetV2(weights="imagenet")
print("Validator model loaded ✅")

PLANT_KEYWORDS = [
    "leaf", "plant", "tree", "flower", "herb",
    "grass", "crop", "vegetation", "foliage",
    "corn", "wheat", "rice", "sugarcane", "cotton",
    "soybean", "potato", "tomato", "cabbage",
    "broccoli", "cauliflower", "spinach", "lettuce",
    "rapeseed", "cardoon", "artichoke", "zucchini",
    "cucumber", "bell_pepper", "pineapple",
    "lemon", "orange", "banana", "mango",
    "strawberry", "fig", "acorn", "buckeye",
    "daisy", "sunflower", "mushroom", "fungus",
    "fruit", "hip", "gyromitra", "earthstar",
    "coral_fungus", "hen-of-the-woods",
    "oak", "palm", "maple", "willow",
    "conifer", "agaric"
]

def validate_leaf_image(image_path):

    img = Image.open(image_path).convert("RGB")
    img = img.resize((224, 224))
    img_array = np.array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = preprocess_input(img_array)

    preds = validator_model.predict(img_array, verbose=0)
    decoded = decode_predictions(preds, top=5)[0]

    top_score = float(decoded[0][2])

    # RULE 1 — keyword match in top 5
    for _, label, score in decoded:
        if any(keyword in label.lower() for keyword in PLANT_KEYWORDS):
            return True

    # RULE 2 — model is uncertain, likely a crop/leaf not in ImageNet
    if top_score < 0.55:
        return True

    # RULE 3 — green channel dominance (leaves are green)
    original_img = Image.open(image_path).convert("RGB")
    img_rgb = np.array(original_img, dtype=np.float32)
    r_mean = img_rgb[:, :, 0].mean()
    g_mean = img_rgb[:, :, 1].mean()
    b_mean = img_rgb[:, :, 2].mean()

    if g_mean > r_mean and g_mean > b_mean:
        return True

    return False