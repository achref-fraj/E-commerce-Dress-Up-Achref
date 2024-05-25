from flask import Flask, request, jsonify, abort
from flask_cors import CORS
import numpy as np
import pickle as pkl
import tensorflow as tf
from tensorflow.keras.applications.resnet50 import ResNet50, preprocess_input
from tensorflow.keras.preprocessing import image
from tensorflow.keras.layers import GlobalMaxPool2D
from sklearn.neighbors import NearestNeighbors
import os
from numpy.linalg import norm
import base64
from datetime import datetime

app = Flask(__name__)
CORS(app)

image_features = pkl.load(open('Images_features.pkl', 'rb'))
filenames = pkl.load(open('filenames.pkl', 'rb'))

resnet = ResNet50(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
model = tf.keras.models.Sequential([resnet, GlobalMaxPool2D()])

neighbors = NearestNeighbors(n_neighbors=6, algorithm='brute', metric='euclidean')
neighbors.fit(image_features)

def extract_features(image_path):
    img = image.load_img(image_path, target_size=(224, 224))
    img_array = image.img_to_array(img)
    img_expanded = np.expand_dims(img_array, axis=0)
    img_preprocessed = preprocess_input(img_expanded)
    features = model.predict(img_preprocessed).flatten()
    normalized = features / norm(features)
    return normalized

@app.route('/recommend', methods=['POST'])
def recommend():
    if 'image' not in request.files:
        abort(400, "Aucune image téléchargée.")

    image_file = request.files['image']
    if not os.path.exists('upload'):
        os.makedirs('upload')

    upload_path = os.path.join('upload', f"{datetime.now().strftime('%Y%m%d%H%M%S')}-{image_file.filename}")
    image_file.save(upload_path)

    features = extract_features(upload_path)

    distances, indices = neighbors.kneighbors([features])

    recommendations = []
    for idx in indices[0][1:]:
        recommended_image_path = filenames[idx]
        if os.path.exists(recommended_image_path):
            with open(recommended_image_path, 'rb') as img_file:
                encoded_image = base64.b64encode(img_file.read()).decode('utf-8')
                recommendations.append(encoded_image)
        else:
            recommendations.append(None)

    return jsonify({"recommendations": recommendations})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
