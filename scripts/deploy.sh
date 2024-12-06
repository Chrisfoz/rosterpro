#!/bin/bash

# Configuration
APP_NAME="rosterpro"
DEPLOY_DIR="/var/www/$APP_NAME"
GIT_BRANCH="main"

# Ensure we're in the correct directory
cd "$(dirname "$0")"/.. || exit

# Pull latest changes
echo "Pulling latest changes..."
git checkout $GIT_BRANCH
git pull

# Install dependencies and build server
echo "Building server..."
cd server
npm install
npm run build

# Run database migrations
echo "Running database migrations..."
npm run db:migrate

# Install dependencies and build client
echo "Building client..."
cd ../client
npm install
npm run build

# Deploy built files
echo "Deploying application..."
sudo mkdir -p $DEPLOY_DIR
sudo cp -r server/dist/* $DEPLOY_DIR/server/
sudo cp -r client/dist/* $DEPLOY_DIR/client/

# Restart services
echo "Restarting services..."
sudo systemctl restart $APP_NAME

echo "Deployment complete!"
