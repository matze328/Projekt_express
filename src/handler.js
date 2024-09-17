

const serverless = require('serverless-http');
const express = require('express');
const { handleS3Event } = require('./controllers/lambdaController');

const app = express();
app.use(express.json());

app.post('/s3-event', handleS3Event);

module.exports.handler = serverless(app);