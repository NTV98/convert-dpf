#!/bin/bash
set -e

# Create necessary directories
mkdir -p temp public/pdf

# Ensure permissions
chmod -R 777 temp public/pdf

# Build and start the application
docker-compose build
docker-compose up -d

echo "Application is running on port 7000"
echo "You can access the API documentation at http://localhost:7000/api"
