#!/bin/bash
# =============================================================================
# Package Backend Functions
# =============================================================================
#
# This script packages all backend Lambda functions for deployment by:
# 1. Installing dependencies using npm ci
# 2. Creating deployment-ready zip files containing only the necessary files
#
# Requirements:
# - npm (Node Package Manager)
# - zip command-line utility
# - Backend functions must be in the backend/ directory
# - Each backend function must have a package.json and index.js
#
# Usage:
#   ./scripts/package-backend.sh
#
# Output:
#   Creates a dist/ directory containing zip files for each backend function:
#   dist/
#   ├── upload-presigned-url.zip
#   ├── list-videos.zip
#   └── ...
#
# Each zip file contains:
#   - index.js
#   - node_modules/
#
# Exit Codes:
#   0 - Success
#   1 - Error (script will exit immediately on any error due to set -e)
# =============================================================================

set -e

if [ -z "$1" ]; then
  # No argument provided — package all
  rm -rf dist
  mkdir dist
  
  for dir in backend/*; do
    if [ -d "$dir" ]; then
      FUNCTION_NAME=$(basename $dir)
      echo "Packaging $FUNCTION_NAME..."
      cd "$dir"
      npm ci
      zip -r "../../dist/${FUNCTION_NAME}.zip" index.js node_modules
      cd - > /dev/null
    fi
  done
else
  # Argument provided — package only one
  FUNCTION_NAME="$1"
  DIR="backend/${FUNCTION_NAME}"
  if [ ! -d "$DIR" ]; then
    echo "Error: function $FUNCTION_NAME does not exist."
    exit 1
  fi

  # Ensure dist directory exists
  mkdir -p dist

  echo "Packaging $FUNCTION_NAME..."
  cd "$DIR"
  npm ci
  zip -r "../../dist/${FUNCTION_NAME}.zip" index.js node_modules
  cd - > /dev/null
fi

echo "✅ Packaging completed." 