import pandas as pd
from sklearn.tree import DecisionTreeClassifier

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

# Features used by the model
X = df[
    [
        "rainfall",
        "water_level",
        "humidity"
    ]
]

# Target
y = df["risk"]

# Create model
model = DecisionTreeClassifier(
    random_state=42,
    max_depth=4
)

# Train model
model.fit(X, y)

# Example new situation
new_data = pd.DataFrame([
    {
        "rainfall": 190,
        "water_level": 7.0,
        "humidity": 88
    }
])

prediction = model.predict(new_data)

probabilities = model.predict_proba(new_data)

print("Flood Risk Prediction:", prediction[0])

print("Prediction probabilities:")

for risk, probability in zip(
    model.classes_,
    probabilities[0]
):
    print(
        f"{risk}: {probability * 100:.2f}%"
    )