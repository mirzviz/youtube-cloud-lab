# Cleanup Utilities for S3/DynamoDB Consistency

This directory contains scripts to help maintain data consistency between your S3 bucket and DynamoDB table for video uploads.

## Scripts

### 1. dynamodb-corruption-cleanup.js
Removes DynamoDB records and S3 objects for videos where the S3 file is likely corrupted (e.g., file size < 1KB).

- **Use case:** Clean up DynamoDB and S3 from failed or incomplete uploads.
- **How it works:**
  - Scans all items in the `Videos` DynamoDB table.
  - For each item, checks the corresponding S3 object size.
  - If the file is smaller than the threshold (default: 1KB), deletes both the S3 object and the DynamoDB record.
- **Run with:**
  ```bash
  npm start
  # or
  node dynamodb-corruption-cleanup.js
  ```

### 2. s3-orphan-cleanup.js
Removes S3 objects that do not have a corresponding record in the DynamoDB table ("orphaned" files).

- **Use case:** Clean up S3 from files that are not tracked in DynamoDB (e.g., after manual uploads or failed DB writes).
- **How it works:**
  - Lists all objects in the S3 bucket.
  - For each object, checks if a DynamoDB record exists for the video ID (derived from the filename).
  - If no record exists, deletes the S3 object.
- **Run with:**
  ```bash
  node s3-orphan-cleanup.js
  ```

## Prerequisites
- Node.js 18+
- AWS credentials with access to the target S3 bucket and DynamoDB table
- Install dependencies:
  ```bash
  npm install
  ```

## Configuration
- Update the region, table name, and bucket name at the top of each script if needed.

## Safety
- **Back up your data before running these scripts in production!**
- Scripts print a summary of actions taken (checked/deleted counts). 