// src/lambda.js

const app = require('./app'); // Verwende require statt import
const serverless = require('serverless-http');

// Exportiere den Handler für AWS Lambda
module.exports.handler = serverless(app); // Verwende module.exports statt export const