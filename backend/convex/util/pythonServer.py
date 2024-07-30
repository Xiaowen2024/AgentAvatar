from flask import Flask, request, jsonify
import subprocess

app = Flask(__name__)

@app.route('/extractevent', methods=['POST'])
def process_data():
    data = request.json
    if data.get('action') == 'extract_event':
        result = subprocess.run(
            ['python', '../Memory/extract_event.py', data.get('text', '')],
            capture_output=True, text=True
        )
        return jsonify({'result': result.stdout.strip()})
    return jsonify({'result': 'Invalid action'})

if __name__ == '__main__':
    app.run(port=8080)