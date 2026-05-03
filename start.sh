#!/bin/bash

# Thulomanche - Development Startup Script
# Start Thulomanche frontend (Vite)

echo "🚀 Starting Thulomanche..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 is not installed"
    exit 1
fi

# Start Media Downloader Backend
echo ""
echo "Starting Media Downloader Backend..."
cd media-downloader-backend
python3 app.py &
BACKEND_PID=$!
echo "✓ Media Downloader Backend started (PID: $BACKEND_PID)"
cd ..

# Start Frontend (Vite)
echo ""
echo "Starting Frontend Server..."
cd frontend/

if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

npm run dev &
FRONTEND_PID=$!
echo "✓ Frontend started (PID: $FRONTEND_PID)"
cd ..

echo ""
echo "════════════════════════════════════════"
echo "✅ Thulomanche is ready!"
echo "════════════════════════════════════════"
echo ""
echo "🌐 Frontend: http://localhost:5173"
echo "🔧 Media Downloader Backend: http://localhost:8899"
echo ""
echo "Press Ctrl+C to stop servers"
echo ""

# Keep script running
wait
