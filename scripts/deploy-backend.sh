#!/bin/bash
set -e

if [ -z "$1" ]; then
  # Deploy all
  cd dist

  for file in *.zip; do
    FUNCTION_NAME="${file%.zip}"
    echo "Deploying $FUNCTION_NAME..."
    aws lambda update-function-code \
      --function-name "$FUNCTION_NAME" \
      --zip-file "fileb://$file" \
      --region eu-north-1
  done

  cd - > /dev/null
else
  # Deploy specific function
  FUNCTION_NAME="$1"
  ZIP_FILE="dist/${FUNCTION_NAME}.zip"

  if [ ! -f "$ZIP_FILE" ]; then
    echo "Error: zip file $ZIP_FILE not found."
    exit 1
  fi

  echo "Deploying $FUNCTION_NAME..."
  aws lambda update-function-code \
    --function-name "$FUNCTION_NAME" \
    --zip-file "fileb://$ZIP_FILE" \
    --region eu-north-1
fi

echo "✅ Deployment completed." 