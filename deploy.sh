#!/bin/bash

# Deployment script for StudyFlow React

# Exit on any error
set -e

# Check for required tools
command -v npm >/dev/null 2>&1 || { echo >&2 "npm is required but not installed. Aborting."; exit 1; }
command -v vercel >/dev/null 2>&1 || { echo >&2 "Vercel CLI is required. Install with 'npm install -g vercel'. Aborting."; exit 1; }

# Ensure we're in the right directory
cd "$(dirname "$0")"

# Install dependencies
echo "Installing dependencies..."
npm install

# Lint the project
echo "Running linter..."
npm run lint

# Build the project
echo "Building project..."
npm run build

# Deploy to Vercel
echo "Deploying to Vercel..."
vercel

# Optional: Open the deployed site
echo "Deployment complete! Opening deployed site..."
vercel ls | grep -m 1 "vercel.app" | awk '{print $1}' | xargs open

echo "Deployment successful!"
