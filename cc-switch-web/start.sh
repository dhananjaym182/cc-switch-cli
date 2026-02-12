#!/bin/bash

# CC-Switch Web Quick Start Script

set -e

echo "=========================================="
echo "CC-Switch Web - Quick Start"
echo "=========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✓ Node.js found: $(node --version)"

# Check if cc-switch is available
if command -v cc-switch &> /dev/null; then
    echo "✓ cc-switch CLI found in PATH"
elif [ -f "../../src-tauri/target/release/cc-switch" ]; then
    echo "✓ cc-switch CLI found in local build"
else
    echo "⚠ Warning: cc-switch CLI not found. Please install or build cc-switch first."
    echo "  See: https://github.com/saladday/cc-switch-cli"
fi

echo ""
echo "Installing dependencies..."
echo ""

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
if [ ! -d "node_modules" ]; then
    npm install
else
    echo "  (already installed)"
fi
cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
if [ ! -d "node_modules" ]; then
    npm install
else
    echo "  (already installed)"
fi
cd ..

echo ""
echo "=========================================="
echo "✅ Setup Complete!"
echo "=========================================="
echo ""
echo "To start the application:"
echo ""
echo "  Terminal 1 (Backend):"
echo "    cd backend && npm start"
echo ""
echo "  Terminal 2 (Frontend):"
echo "    cd frontend && npm run dev"
echo ""
echo "Then open: http://localhost:3000"
echo ""
echo "For more information, see README.md"
echo ""
