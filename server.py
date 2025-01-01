from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import subprocess
import json
import shutil
import uuid

app = Flask(__name__)
CORS(app)
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/split-stems', methods=['POST'])
def split_stems():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file:
        # Generate unique filename
        file_extension = os.path.splitext(file.filename)[1]
        unique_filename = str(uuid.uuid4()) + file_extension
        upload_path = unique_filename

        try:
            # Save uploaded file to upload folder
            file.save(upload_path)
            print('File saved to:', upload_path)

            # Run demucs command
            output_dir = os.path.join(app.config['UPLOAD_FOLDER'], os.path.splitext(os.path.basename(unique_filename))[0])
            os.makedirs(output_dir, exist_ok=True)

            command = [
                "demucs",
                 "--model",
                "demucs",
                "--two-stems",
                "vocals",
                "-o",
                app.config['UPLOAD_FOLDER'],
                upload_path
            ]
            print('Executing command:', command)
            result = subprocess.run(command, capture_output=True, text=True, check=True)
            print('Demucs Output:', result.stdout)
            print('Demucs Error:', result.stderr)

            # Collect stems
            stem_files = []
            
            stem_dir = os.path.join(output_dir, 'vocals')
            
            for root, dirs, files in os.walk(stem_dir):
              for file in files:
                if file.endswith(".wav"):
                    stem_files.append(f"http://localhost:8000/uploads/{os.path.splitext(os.path.basename(unique_filename))[0]}/vocals/" + file)
            
            command = [
                "demucs",
                 "--model",
                "demucs",
                "--two-stems",
                "drums",
                "-o",
                app.config['UPLOAD_FOLDER'],
                upload_path
            ]
            print('Executing command:', command)
            result = subprocess.run(command, capture_output=True, text=True, check=True)
            print('Demucs Output:', result.stdout)
            print('Demucs Error:', result.stderr)


            stem_dir = os.path.join(output_dir, 'drums')
            for root, dirs, files in os.walk(stem_dir):
              for file in files:
                if file.endswith(".wav"):
                    stem_files.append(f"http://localhost:8000/uploads/{os.path.splitext(os.path.basename(unique_filename))[0]}/drums/" + file)


            command = [
                "demucs",
                 "--model",
                "demucs",
                "--two-stems",
                "bass",
                "-o",
                app.config['UPLOAD_FOLDER'],
                upload_path
            ]
            print('Executing command:', command)
            result = subprocess.run(command, capture_output=True, text=True, check=True)
            print('Demucs Output:', result.stdout)
            print('Demucs Error:', result.stderr)

            stem_dir = os.path.join(output_dir, 'bass')
            for root, dirs, files in os.walk(stem_dir):
              for file in files:
                if file.endswith(".wav"):
                    stem_files.append(f"http://localhost:8000/uploads/{os.path.splitext(os.path.basename(unique_filename))[0]}/bass/" + file)

            command = [
                "demucs",
                 "--model",
                "demucs",
                "--two-stems",
                "other",
                "-o",
                app.config['UPLOAD_FOLDER'],
                upload_path
            ]
            print('Executing command:', command)
            result = subprocess.run(command, capture_output=True, text=True, check=True)
            print('Demucs Output:', result.stdout)
            print('Demucs Error:', result.stderr)

            stem_dir = os.path.join(output_dir, 'other')
            for root, dirs, files in os.walk(stem_dir):
              for file in files:
                if file.endswith(".wav"):
                    stem_files.append(f"http://localhost:8000/uploads/{os.path.splitext(os.path.basename(unique_filename))[0]}/other/" + file)

            return jsonify({'stems': stem_files})

        except Exception as e:
            print('Error during stem extraction:', e)
            return jsonify({'error': str(e)}), 500

    return jsonify({'error': 'Unexpected error'}), 500


@app.route('/uploads/<path:path>')
def get_file(path):
    return app.send_from_directory(app.config['UPLOAD_FOLDER'], path)

if __name__ == '__main__':
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    app.run(debug=True, port=8000)