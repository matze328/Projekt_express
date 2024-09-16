// src/db.js

const { DynamoDB } = require('@aws-sdk/client-dynamodb');

const dynamoDBClient = new DynamoDB({ region: 'eu-central-1' }); // Setze deine Region
const TABLE_NAME = 'Songs'; // Name deiner DynamoDB-Tabelle

// Funktion zum Speichern von Metadaten in DynamoDB
const saveMetadataToDynamoDB = async (fileName, metadata) => {
    const params = {
        TableName: TABLE_NAME,
        Item: {
            fileName: { S: fileName }, // Primärschlüssel
            artist: { S: metadata.artist || '' }, // Künstlername
            album: { S: metadata.album || '' }, // Albumname
        },
    };

    try {
        await dynamoDBClient.putItem(params);
        console.log(`Metadata for ${fileName} saved successfully.`);
    } catch (error) {
        console.error('Error saving metadata to DynamoDB:', error);
        throw new Error('Could not save metadata to DynamoDB');
    }
};

module.exports = { saveMetadataToDynamoDB };