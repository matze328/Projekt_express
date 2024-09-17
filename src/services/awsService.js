
const { S3 } = require("@aws-sdk/client-s3");
const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");

const s3 = new S3();
const dynamoDb = new DynamoDBClient();

const uploadToDynamoDB = async (bucket, key) => {
    const params = { Bucket: bucket, Key: key };

    try {
        const { ContentType } = await s3.getObject(params);
        console.log('CONTENT TYPE:', ContentType);

        const s3Url = `https://${bucket}.s3.amazonaws.com/${key}`;
        const songID = key.split('/').pop().split('.')[0];

        const dynamoParams = {
            TableName: 'Songs',
            Item: {
                SongID: { S: songID },
                FileName: { S: key },
                S3Url: { S: s3Url },
                ContentType: { S: ContentType }
            }
        };

        await dynamoDb.send(new PutItemCommand(dynamoParams));
        console.log('Metadata saved to DynamoDB:', dynamoParams.Item);

        return ContentType;
    } catch (err) {
        console.error(err);
        throw new Error(`Error getting object ${key} from bucket ${bucket}.`);
    }
};

module.exports = { uploadToDynamoDB };