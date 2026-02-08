#!/bin/bash

# P2P Chat - Quick Setup Script

echo "🚀 P2P Chat Application Setup"
echo "=============================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "❌ Node.js is not installed. Please install Node.js 14+ first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"
echo ""

# Get local IP address
echo "🌐 Your local network IP addresses:"
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print "   " $2}'
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    hostname -I | awk '{print "   " $1}'
else
    # Windows
    ipconfig | grep "IPv4" | awk '{print "   " $NF}'
fi

echo ""
echo "📝 Quick Start Guide:"
echo "   1. Start server: npm start"
echo "   2. Open browser: http://localhost:3000"
echo "   3. On other devices: ws://YOUR_IP:3000"
echo ""
echo "🎉 Setup complete! Run 'npm start' to begin."
