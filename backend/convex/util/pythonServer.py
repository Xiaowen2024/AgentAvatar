from flask import Flask, request, jsonify
import subprocess

app = Flask(__name__)

@app.route('/extractevent', methods=['POST'])
def extract_event():
    data = request.json
    if data.get('action') == 'extract_event':
        result = subprocess.run(
            ['python', '../Memory/extract_event.py', data.get('text', '')],
            capture_output=True, text=True
        )
        return jsonify({'result': result.stdout.strip()})
    return jsonify({'result': 'Invalid action'})

@app.route('/extractemotion', methods=['POST'])
def extract_emotion():
    data = request.json
    if data.get('action') == 'extract_emotion':
        result = subprocess.run(
            ['python', '../Memory/extract_emotion.py', data.get('text', '')],
            capture_output=True, text=True
        )
        return jsonify({'result': result.stdout.strip()})

if __name__ == '__main__':
    app.run(port=8080)