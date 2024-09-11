// src/lambda.js

const { Lambda } = require('@aws-sdk/client-lambda');
const { saveMetadataToDynamoDB } = require('./db'); // Importiere die Funktion zum Speichern in DynamoDB

const lambdaClient = new Lambda({ region: 'eu-central-1' }); // Setze deine Region

const invokeLambdaFunction = async (fileName, metadata) => {
    const params = {
        FunctionName: 'metadaten_trigger', // Name deiner Lambda-Funktion
        InvocationType: 'RequestResponse', // Warten auf Antwort von der Funktion
        Payload: JSON.stringify({ fileName, metadata }), // Übergebe die Daten als Payload
    };

    try {
        const response = await lambdaClient.invoke(params);
        return JSON.parse(new TextDecoder('utf-8').decode(response.Payload));
    } catch (error) {
        console.error('Error invoking Lambda function:', error);
        throw new Error('Could not invoke Lambda function');
    }
};

// Neue Funktion zum Speichern der Metadaten direkt in DynamoDB
const processAndSaveMetadata = async (fileName, metadata) => {
    await saveMetadataToDynamoDB(fileName, metadata); // Speichere die Metadaten in DynamoDB
};

module.exports = { invokeLambdaFunction, processAndSaveMetadata };