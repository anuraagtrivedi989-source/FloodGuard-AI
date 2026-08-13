from flask import Flask, request, jsonify
import pandas as pd
from sklearn.tree import DecisionTreeClassifier

app = Flask(__name__)

# Training data
data = {
    "rainfall": [40, 70, 100, 150, 180, 210, 60, 120],
    "water_level": [1.5, 2.2, 3.0, 4.5, 6.0, 8.0, 2.0, 4.0],
    "humidity": [60, 65, 70, 78, 82, 91, 68, 75],
    "risk": [
        "Low",
        "Low",
        "Medium",
        "Medium",
        "High",
        "Critical",
        "Low",
        "Medium"
    ]
}

df = pd.DataFrame(data)

X = df[
    [
        "rainfall",
        "water_level",
        "humidity"
    ]
]

y = df["risk"]

# Train model
model = DecisionTreeClassifier(
    random_state=42,
    max_depth=4
)

model.fit(X, y)


@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()

    rainfall = data.get("rainfall")
    water_level = data.get("water_level")
    humidity = data.get("humidity")

    input_data = pd.DataFrame([
        {
            "rainfall": rainfall,
            "water_level": water_level,
            "humidity": humidity
        }
    ])

    prediction = model.predict(input_data)[0]

    probabilities = model.predict_proba(input_data)[0]

    probability = max(probabilities)

    return jsonify({
        "risk": prediction,
        "probability": round(float(probability), 4)
    })


@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ML service is running"
    })


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5001,
        debug=True
    )