from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for local development

TASKS_FILE = 'tasks.json'

@app.route('/')
def index():
    """Serve the frontend HTML file"""
    return send_from_directory('.', 'index.html')

@app.route('/static/<path:filename>')
def static_files(filename):
    """Serve static files (CSS, JS)"""
    return send_from_directory('static', filename)

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    """Load tasks from tasks.json"""
    try:
        if os.path.exists(TASKS_FILE):
            with open(TASKS_FILE, 'r', encoding='utf-8') as file:
                tasks = json.load(file)
                return jsonify({
                    'success': True,
                    'tasks': tasks,
                    'message': f'Loaded {len(tasks)} tasks successfully'
                })
        else:
            return jsonify({
                'success': True,
                'tasks': [],
                'message': 'No tasks file found. Starting with empty task list.'
            })
    except Exception as e:
        return jsonify({
            'success': False,
            'tasks': [],
            'message': f'Error loading tasks: {str(e)}'
        }), 500

@app.route('/api/tasks', methods=['POST'])
def save_tasks():
    """Save tasks to tasks.json"""
    try:
        data = request.get_json()
        tasks = data.get('tasks', [])
        
        with open(TASKS_FILE, 'w', encoding='utf-8') as file:
            json.dump(tasks, file, indent=2, ensure_ascii=False)
        
        return jsonify({
            'success': True,
            'message': f'Saved {len(tasks)} tasks successfully'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error saving tasks: {str(e)}'
        }), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)