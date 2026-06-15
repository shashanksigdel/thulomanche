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

echo ""
echo "Starting Frontend Server..."
cd frontend/

if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

npm run dev
