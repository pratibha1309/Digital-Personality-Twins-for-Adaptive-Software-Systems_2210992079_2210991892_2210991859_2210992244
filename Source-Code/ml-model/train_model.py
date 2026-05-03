import pandas as pd
from sklearn.cluster import KMeans
import joblib

data = pd.read_csv("dataset.csv")

X = data[['linksOpened','decisionTime','scrollDepth','clickPosition']]

model = KMeans(n_clusters=3)

model.fit(X)

joblib.dump(model,"personality_model.pkl")

print("Model trained")