#!/bin/bash
set -e

# Load function name mapping
FUNCTIONS_MAP=$(cat backend/functions-map.json)

if [ -z "$1" ]; then
  # Deploy all
  cd dist

  for file in *.zip; do
    FOLDER_NAME="${file%.zip}"
    # Get Lambda function name from mapping
    FUNCTION_NAME=$(echo "$FUNCTIONS_MAP" | jq -r --arg folder "$FOLDER_NAME" '.[$folder]')
    
    echo "Deploying $FOLDER_NAME (Lambda: $FUNCTION_NAME)..."
    aws lambda update-function-code \
      --function-name "$FUNCTION_NAME" \
      --zip-file "fileb://$file" \
      --region eu-north-1
  done

  cd - > /dev/null
else
  # Deploy specific function
  FOLDER_NAME="$1"
  ZIP_FILE="dist/${FOLDER_NAME}.zip"

  if [ ! -f "$ZIP_FILE" ]; then
    echo "Error: zip file $ZIP_FILE not found."
    exit 1
  fi

  # Get Lambda function name from mapping
  FUNCTION_NAME=$(echo "$FUNCTIONS_MAP" | jq -r --arg folder "$FOLDER_NAME" '.[$folder]')
  
  if [ "$FUNCTION_NAME" = "null" ]; then
    echo "Error: no mapping found for function $FOLDER_NAME"
    exit 1
  fi

  echo "Deploying $FOLDER_NAME (Lambda: $FUNCTION_NAME)..."
  aws lambda update-function-code \
    --function-name "$FUNCTION_NAME" \
    --zip-file "fileb://$ZIP_FILE" \
    --region eu-north-1
fi

echo "✅ Deployment completed." 