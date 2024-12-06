#!/bin/bash

# Check system requirements
command -v node >/dev/null 2>&1 || { echo "Node.js is required but not installed."; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "npm is required but not installed."; exit 1; }
command -v psql >/dev/null 2>&1 || { echo "PostgreSQL is required but not installed."; exit 1; }

# Create necessary directories
mkdir -p logs

# Install server dependencies
echo "Installing server dependencies..."
cd server
npm install

# Install client dependencies
echo "Installing client dependencies..."
cd ../client
npm install

# Setup environment files if they don't exist
if [ ! -f "../server/.env" ]; then
    echo "Creating server .env file..."
    cp ../server/.env.example ../server/.env
fi

if [ ! -f "../client/.env" ]; then
    echo "Creating client .env file..."
    cp ../client/.env.example ../client/.env
fi

# Initialize database
echo "Setting up database..."
cd ../server
npm run db:migrate
npm run db:seed

echo "Setup complete! You can now start the application:"
echo "1. Start the server: cd server && npm start"
echo "2. Start the client: cd client && npm run dev"
