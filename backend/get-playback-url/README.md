# Get Playback URL Lambda

This Lambda function generates a signed S3 URL for video playback. It retrieves the video's S3 key from DynamoDB and generates a pre-signed URL that expires in 10 minutes.

## Environment Variables

- `BUCKET_NAME`: The S3 bucket name (default: 'youtube-dev-zvi-uploads')
- `TABLE_NAME`: The DynamoDB table name (default: 'Videos')

## API

### Request

```
GET /get-playback-url?videoId=<videoId>
```

### Response

Success (200):
```json
{
  "playbackUrl": "https://..."
}
```

Error (400):
```json
{
  "error": "Missing videoId parameter"
}
```

Error (404):
```json
{
  "error": "Video not found"
}
```

Error (500):
```json
{
  "error": "Internal server error"
}
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Deploy to AWS Lambda with appropriate IAM roles for DynamoDB and S3 access. 