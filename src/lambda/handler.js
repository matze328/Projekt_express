// src/handler.js

const { S3 } = require('@aws-sdk/client-s3');
const { DynamoDB } = require('@aws-sdk/client-dynamodb');
 
const s3 = new S3();
const dynamoDB = new DynamoDB();

const uploadFile = async (fileName, fileContent) => {
    const bucket = 'music-app-bucket'; // Dein Bucket-Name

    try {
        // Hier kannst du den Code zum Hochladen der Datei in S3 hinzufügen.
        const params = {
            Bucket: bucket,
            Key: fileName,
            Body: Buffer.from(fileContent, 'base64'), // Angenommen, der Inhalt wird als Base64 übergeben
            ContentType: 'audio/x-m4a',
        };

        await s3.putObject(params);

        console.log(`File uploaded successfully to ${bucket}/${fileName}`);

        // Optional: Speichere Metadaten in DynamoDB oder führe andere Operationen durch.

        return { message: 'File uploaded successfully!' };
    } catch (error) {
        console.error(error);
        throw new Error('Error uploading file');
    }
};

module.exports = { uploadFile }; // Exportiere die Funktion