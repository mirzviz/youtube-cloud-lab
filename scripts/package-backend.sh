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

rm -rf dist
mkdir dist

for dir in backend/*; do
  if [ -d "$dir" ]; then
    echo "Packaging $dir..."
    cd "$dir"
    npm ci
    zip -r "../../dist/$(basename $dir).zip" index.js node_modules
    cd - > /dev/null
  fi
done

echo "✅ All backend functions packaged successfully." 