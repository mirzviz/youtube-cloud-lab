const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();

const BUCKET_NAME = process.env.BUCKET_NAME || 'youtube-dev-zvi-uploads';
const TABLE_NAME = process.env.TABLE_NAME || 'Videos';

// Common headers for all responses
const COMMON_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
};

// Helper function to create response objects
const createResponse = (statusCode, body) => ({
  statusCode,
  headers: COMMON_HEADERS,
  body: JSON.stringify(body)
});

exports.handler = async (event) => {
  try {
    const params = new URLSearchParams(event.queryStringParameters || '');
    const videoId = params.get('videoId');

    if (!videoId) {
      return createResponse(400, { error: 'Missing videoId parameter' });
    }

    const result = await dynamo.get({
      TableName: TABLE_NAME,
      Key: { videoId },
    }).promise();

    if (!result.Item) {
      return createResponse(404, { error: 'Video not found' });
    }

    const s3Key = result.Item.s3Key;
    if (!s3Key) {
      return createResponse(500, { error: 'Missing s3Key for video' });
    }

    const signedUrl = s3.getSignedUrl('getObject', {
      Bucket: BUCKET_NAME,
      Key: s3Key,
      Expires: 60 * 10, // URL expires in 10 minutes
    });

    return createResponse(200, { playbackUrl: signedUrl });
  } catch (err) {
    console.error('Error getting playback URL:', err);
    return createResponse(500, { error: 'Internal server error' });
  }
}; 