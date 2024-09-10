const { Router } = require('express');
const { StatusCodes } = require('http-status-codes');
const { DynamoDB } = require('aws-sdk');
const dynamoDB = require('../../database/dynamoDB/setup');
const { uploadFile } = require('../../lambda/handler');

const SongRouter = Router();

// Route für alle m4p-Songs
SongRouter.get('/all', async (req, res) => {
  const params = {
    TableName: 'Songs',
    FilterExpression: 'contains(FileType, :m4p)', // Filtert nach MP3-Dateien
    ExpressionAttributeValues: {
      ':m4p': 'm4p',
    },
  };

  try {
    const result = await dynamoDB.scan(params).promise();
    console.log('Alle m4p-Songs gefunden:', result.Items);
    return res.status(200).json(result.Items);
  } catch (error) {
    console.error('Fehler beim Abrufen der Songs:', error);
    return res.status(500).json({ message: 'Interner Serverfehler' });
  }
});

// Route für einen bestimmten Song anhand der SongID
SongRouter.get('/songid', async (req, res) => {
  const songId = req.params.songId; // SongID aus den URL-Parametern abrufen
  const params = {
    TableName: 'Songs',
    Key: { SongID: songId },
  };

  try {
    const result = await dynamoDB.get(params).promise();

    if (result.Item) {
      console.log('Eintrag gefunden:', result.Item);
      return res.status(200).json(result.Item);
    } else {
      console.log('Kein Eintrag gefunden für SongID:', songId);
      return res.status(404).json({ message: 'Song nicht gefunden' });
    }
  } catch (error) {
    console.error('Fehler beim Abrufen des Eintrags:', error);

    if (error.code === 'ResourceNotFoundException') {
      return res.status(404).json({ message: 'Tabelle nicht gefunden' });
    } else if (error.code === 'ValidationException') {
      return res.status(400).json({ message: 'Ungültige Anfrage' });
    } else {
      return res.status(500).json({ message: 'Interner Serverfehler' });
    }
  }
});

SongRouter.post('/upload', async (req, res) => {
  const { fileName, fileContent } = req.body; // Erwarte einen Dateinamen und den Inhalt der Datei im Body

  try {
      const result = await uploadFile(fileName, fileContent);
      return res.status(200).json(result);
  } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
  }
});



module.exports = { SongRouter };
