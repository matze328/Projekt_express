const  {S3} = require("@aws-sdk/client-s3");
const { DynamoDBClient, PutItemCommand }  = require("@aws-sdk/client-dynamodb")

console.log('Loading function');

// Initialisieren von S3 und DynamoDB Clients
const s3 = new S3();
const dynamoDb = new DynamoDBClient();

 const handler = async (event) => {
    const bucket = event.Records[0].s3.bucket.name;
    const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
    
    const params = {
        Bucket: bucket,
        Key: key,
    };
    
    try {
        // Abrufen des Objekts aus S3, um die ContentType zu erhalten
        const { ContentType } = await s3.getObject(params);
        console.log('CONTENT TYPE:', ContentType);
        
        // S3-URL der Datei erstellen
        const s3Url = `https://${bucket}.s3.amazonaws.com/${key}`;
        
        // SongID aus dem Dateinamen ableiten (z.B. ohne Dateierweiterung)
        const songID = key.split('/').pop().split('.')[0];
        
        // DynamoDB-Parameter vorbereiten
        const dynamoParams = {
            TableName: 'Songs',  // Dein DynamoDB-Tabellenname
            Item: {
                SongID: { S: songID },  // Partition Key
                FileName: { S: key },
                S3Url: { S: s3Url },
                ContentType: { S: ContentType }
            }
        };
        
        // Speichern der Metadaten in DynamoDB
        await dynamoDb.send(new PutItemCommand(dynamoParams));
        console.log('Metadata saved to DynamoDB:', dynamoParams.Item);
        
        return ContentType;
        
    } catch (err) {
        console.log(err);
        const message = `Error getting object ${key} from bucket ${bucket}. Make sure they exist and your bucket is in the same region as this function.`;
        console.log(message);
        throw new Error(message);
    }
};
