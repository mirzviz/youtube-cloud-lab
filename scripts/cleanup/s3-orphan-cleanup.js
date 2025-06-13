import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import { S3Client, ListObjectsV2Command, DeleteObjectCommand } from "@aws-sdk/client-s3";

const REGION = 'eu-north-1';
const TABLE_NAME = 'Videos';
const BUCKET_NAME = 'youtube-dev-zvi-uploads';

const ddbClient = new DynamoDBClient({ region: REGION });
const docClient = DynamoDBDocumentClient.from(ddbClient);
const s3 = new S3Client({ region: REGION });

async function cleanUpS3Orphans() {
    let continuationToken = undefined;
    let totalChecked = 0;
    let totalDeleted = 0;

    do {
        const listResult = await s3.send(new ListObjectsV2Command({
            Bucket: BUCKET_NAME,
            ContinuationToken: continuationToken
        }));

        const objects = listResult.Contents || [];

        for (const obj of objects) {
            const key = obj.Key;
            const videoId = key.replace('.mp4', '');

            try {
                const result = await docClient.send(new GetCommand({
                    TableName: TABLE_NAME,
                    Key: { videoId }
                }));

                if (!result.Item) {
                    console.log(`Orphaned S3 object: ${key}`);

                    await s3.send(new DeleteObjectCommand({
                        Bucket: BUCKET_NAME,
                        Key: key
                    }));

                    totalDeleted++;
                }
            } catch (err) {
                console.error(`Error processing key ${key}: ${err}`);
            }

            totalChecked++;
        }

        continuationToken = listResult.IsTruncated ? listResult.NextContinuationToken : undefined;
    } while (continuationToken);

    console.log(`Finished S3 orphan cleanup. Checked: ${totalChecked}, Deleted: ${totalDeleted}`);
}

cleanUpS3Orphans().catch(console.error); 