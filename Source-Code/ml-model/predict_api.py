from flask import Flask, request, jsonify
import joblib
import pandas as pd

app = Flask(__name__)

model = joblib.load("personality_model.pkl")

# Map KMeans cluster numbers to personality labels
# Cluster 0: decisionTime ~53s, scrollDepth ~80% → deep scroller
# Cluster 1: decisionTime ~23s, scrollDepth ~33% → fast decider
# Cluster 2: decisionTime ~76s, scrollDepth ~30% → slow, low scroll
PERSONALITY_MAP = {
    0: "Explorer",  # scrolls deep, takes moderate time
    1: "Focused",   # decides fast, low scroll
    2: "Casual"     # slowest decision, low scroll
}

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json

    links_opened   = data.get("linksOpened", 0)
    decision_time  = data.get("decisionTime", 0)
    scroll_depth   = data.get("scrollDepth", 0)
    click_position = data.get("clickPosition", 0)

    features = pd.DataFrame(
        [[links_opened, decision_time, scroll_depth, click_position]],
        columns=["linksOpened", "decisionTime", "scrollDepth", "clickPosition"]
    )

    cluster = int(model.predict(features)[0])
    personality = PERSONALITY_MAP.get(cluster, "Explorer")

    return jsonify({
        "personality": personality,
        "cluster": cluster
    })

if __name__ == "__main__":
    app.run(port=6000, debug=True)
