import logging
import os
from flask import Flask, request, flash, jsonify
import flask
from flask_cors import CORS
from werkzeug.utils import secure_filename
import uuid, argparse

import test_logging as emotion
from autocrop import Cropper
from PIL import Image

cropper = Cropper()
app = Flask(__name__)
CORS(app)
files = []
filenames = []
ROOT_DIR = os.path.abspath("./")
emotionImagePath = os.path.join(ROOT_DIR, "images/face/")
faceImagePath = os.path.join(ROOT_DIR, "images/crop/")
@app.route("/")
@app.route('/index')
def index():
    return flask.render_template('index.html')

@app.route("/model", methods=['POST'])
def uploadImageFile():
    print("server Connection")
    print("들어오긴함?")
    args = {"model_path" : "model.pth", "model" : "emotionnet", "data_path" : "images", "image_size" : 48, "image_channel" : 1, 
    "gpu" : True, "num_workers" : 4, "batch_size" : 1}
    print("들어오긴함?")
    if request.method == 'POST':
        if 'file' not in request.files:
            flash('No file part')
        files = request.files.getlist('file')        
        if len(files) == 0:
            flash('No selected file')
        else:
            for file in files:
                print('앞쪽',file)
                id = uuid.uuid4()
                filenameTemp = secure_filename(file.filename)
                filename = str(id) + "_" + filenameTemp
                file.save(os.path.join(emotionImagePath, filename))
#                 cropped_array = cropper.crop(os.path.join(emotionImagePath,filename))
                cropped_array = cropper.crop(os.path.join(emotionImagePath,filename))
                if cropped_array is not None:
                    cropped_image = Image.fromarray(cropped_array)
                    cropped_image.save(os.path.join(faceImagePath, filename))
                    filenames.append(filename)
                else:
                    continue

            print('app.py filenames : ', filenames)
            if len(filenames) != 0:
                result = emotion.evaluation(args, filenames)
            else:
                result = {"score" : '', "predicted" : ''}
            # result = emotion.evaluation(args, filenames)
            filenames.clear()
        
    print(result)
    
            
    return jsonify(result)

if __name__ == "__main__": 
    app.run(debug=True)

