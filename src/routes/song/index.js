// src/routes.js

const express = require('express');
const { processAndSaveMetadata } = require('../../lambda');
const router = express.Router();

router.post('/upload', async (req, res) => {
    const { fileName, metadata } = req.body;

    try {
        await processAndSaveMetadata(fileName, metadata); // Speichere die Metadaten in DynamoDB
        return res.status(200).json({ message: 'Metadata processed and saved successfully!' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
});

module.exports.AppRouter = router; // Exportiere den Router