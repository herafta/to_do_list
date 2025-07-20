#!/bin/bash

# To-Do List App Startup Script

echo "🚀 Starting To-Do List Web App..."

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔄 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📥 Installing dependencies..."
pip install -r requirements.txt

# Start the application
echo "🌐 Starting Flask server on http://localhost:5000"
echo "📝 Open your browser and navigate to: http://localhost:5000"
echo "⚡ Press Ctrl+C to stop the server"
echo ""

python app.py