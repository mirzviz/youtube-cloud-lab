import { DynamoDBClient, ScanCommand, DeleteItemCommand } from "@aws-sdk/client-dynamodb";
import { S3Client, HeadObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

const REGION = 'eu-north-1';
const TABLE_NAME = 'Videos';
const BUCKET_NAME = 'youtube-dev-zvi-uploads';
const SIZE_THRESHOLD = 1024; // 1KB

const dynamo = new DynamoDBClient({ region: REGION });
const s3 = new S3Client({ region: REGION });

async function cleanUp() {
    let lastEvaluatedKey = undefined;
    let totalChecked = 0;
    let totalDeleted = 0;

    do {
        const scanCommand = new ScanCommand({
            TableName: TABLE_NAME,
            ExclusiveStartKey: lastEvaluatedKey
        });

        const result = await dynamo.send(scanCommand);
        const items = result.Items || [];

        for (const item of items) {
            const videoId = item.videoId.S;
            const s3Key = item.s3Key.S;

            try {
                const headCommand = new HeadObjectCommand({
                    Bucket: BUCKET_NAME,
                    Key: s3Key
                });

                const headResult = await s3.send(headCommand);
                const size = headResult.ContentLength;

                if (size < SIZE_THRESHOLD) {
                    console.log(`Corrupted file detected: ${s3Key} (size: ${size} bytes)`);

                    await s3.send(new DeleteObjectCommand({
                        Bucket: BUCKET_NAME,
                        Key: s3Key
                    }));

                    await dynamo.send(new DeleteItemCommand({
                        TableName: TABLE_NAME,
                        Key: { videoId: { S: videoId } }
                    }));

                    totalDeleted++;
                }
            } catch (err) {
                console.error(`Error checking ${s3Key}: ${err}`);
            }

            totalChecked++;
        }

        lastEvaluatedKey = result.LastEvaluatedKey;
    } while (lastEvaluatedKey);

    console.log(`Finished cleanup. Checked: ${totalChecked}, Deleted: ${totalDeleted}`);
}

cleanUp().catch(console.error); 