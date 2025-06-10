const { DynamoDBClient, ScanCommand } = require('@aws-sdk/client-dynamodb');
const { unmarshall } = require('@aws-sdk/util-dynamodb');

const dynamoClient = new DynamoDBClient({ region: 'eu-north-1' });
const TABLE_NAME = 'Videos'; // Make sure this matches your DynamoDB table name

exports.handler = async (event) => {
    try {
        // Create the scan command
        const command = new ScanCommand({
            TableName: TABLE_NAME
        });

        // Execute the scan
        const { Items } = await dynamoClient.send(command);

        // Convert DynamoDB items to regular JavaScript objects
        const videos = Items.map(item => unmarshall(item));

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*' // Enable CORS
            },
            body: JSON.stringify({
                videos
            })
        };
    } catch (error) {
        console.error('Error scanning videos:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Failed to fetch videos'
            })
        };
    }
}; 