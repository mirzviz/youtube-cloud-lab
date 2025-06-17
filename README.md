# Cloud-First YouTube Clone

This project is a modern YouTube clone built with a cloud-first architecture. It leverages AWS services for video processing, storage, and delivery, with a React-based frontend for a responsive user experience. The backend is designed with serverless functions for video upload handling and processing, while infrastructure is managed through Terraform for consistent and reproducible deployments. 

## Backend Deployment

The backend Lambda functions can be packaged for deployment using the provided script:

```bash
./scripts/package-backend.sh
```

This script will:
- Install dependencies for each backend function
- Create deployment-ready zip files
- Place the zip files in a `dist/` directory

See the script's header comments for detailed usage instructions and requirements.

## Data Cleanup Utilities

Under `scripts/cleanup/` you can find data cleanup utilities for S3/DynamoDB consistency issues.
See `scripts/cleanup/README.md` for full instructions. 