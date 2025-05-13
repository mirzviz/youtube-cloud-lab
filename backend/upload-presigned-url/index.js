const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const s3Client = new S3Client({ region: 'eu-north-1' });
const BUCKET_NAME = 'youtube-dev-zvi-uploads';

// AWS Lambda function to generate presigned URLs for video uploads
exports.handler = async (event) => {
    try {
        // Parse the incoming request body
        const body = JSON.parse(event.body);
        const { filename } = body;

        if (!filename) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: 'Filename is required'
                })
            };
        }

        // Create the command for uploading to S3
        const command = new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: filename,
            ContentType: 'video/mp4' // Assuming MP4 videos, adjust if needed
        });

        // Generate the presigned URL (valid for 15 minutes)
        const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 900 });

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*' // Enable CORS
            },
            body: JSON.stringify({
                uploadUrl: presignedUrl
            })
        };
    } catch (error) {
        console.error('Error generating presigned URL:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Failed to generate upload URL'
            })
        };
    }
}; 