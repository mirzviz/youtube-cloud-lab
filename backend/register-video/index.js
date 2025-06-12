const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');
const { unmarshall } = require('@aws-sdk/util-dynamodb');

const ddbClient = new DynamoDBClient({ region: 'eu-north-1' });

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);

    const { videoId, s3Key, title, description } = body;

    if (!videoId || !title || !s3Key) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing required fields' }),
      };
    }

    const command = new PutItemCommand({
      TableName: 'Videos',
      Item: {
        videoId: { S: videoId },
        s3Key: { S: s3Key },
        title: { S: title },
        description: { S: description || '' },
        createdAt: { S: new Date().toISOString() },
      },
    });

    await ddbClient.send(command);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Video registered successfully' }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};
