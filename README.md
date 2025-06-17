# Cloud-First YouTube Clone

This project is a modern YouTube clone built with a cloud-first architecture. It leverages AWS services for video processing, storage, and delivery, with a React-based frontend for a responsive user experience. The backend is designed with serverless functions for video upload handling and processing, while infrastructure is managed through Terraform for consistent and reproducible deployments. 

## Backend Deployment

The backend Lambda functions can be packaged and deployed using the provided scripts:

### Packaging Functions
```bash
# Package all functions
./scripts/package-backend.sh

# Package a specific function
./scripts/package-backend.sh list-videos
```

### Deploying Functions
```bash
# Deploy all functions
./scripts/deploy-backend.sh

# Deploy a specific function
./scripts/deploy-backend.sh list-videos
```

The scripts handle:
- Installing dependencies
- Creating deployment-ready zip files
- Deploying to AWS Lambda
- Mapping folder names to Lambda function names

Requirements:
- Node.js
- AWS CLI configured
- jq for JSON processing

## Data Cleanup Utilities

Under `scripts/cleanup/` you can find data cleanup utilities for S3/DynamoDB consistency issues.
See `scripts/cleanup/README.md` for full instructions. 