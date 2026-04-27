#!/bin/bash

# Thulomanche - Development Startup Script
# Start both backend and frontend servers

echo "🚀 Starting Thulomanche..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    exit 1
fi

# Check if MongoDB is running (optional check)
echo "📦 Checking dependencies..."

# Start backend
echo ""
echo "Starting Backend Server..."
cd backend

if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
fi

npm run dev &
BACKEND_PID=$!
echo "✓ Backend started (PID: $BACKEND_PID)"

# Start frontend
echo ""
echo "Starting Frontend Server..."
cd ../frontend

if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

npm run dev &
FRONTEND_PID=$!
echo "✓ Frontend started (PID: $FRONTEND_PID)"

echo ""
echo "════════════════════════════════════════"
echo "✅ Thulomanche is ready!"
echo "════════════════════════════════════════"
echo ""
echo "🌐 Frontend: http://localhost:3000"
echo "🔌 Backend:  http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop servers"
echo ""

# Keep script running
wait
