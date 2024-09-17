

const { uploadToDynamoDB } = require('../services/awsService');

const handleS3Event = async (req, res) => {
    const event = req.body; // Angenommen, das Event wird im Body gesendet

    if (!event.Records || event.Records.length === 0) {
        return res.status(400).send('Invalid event data');
    }

    const bucket = event.Records[0].s3.bucket.name;
    const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));

    try {
        const contentType = await uploadToDynamoDB(bucket, key);
        return res.status(200).send({ contentType });
    } catch (error) {
        return res.status(500).send(error.message);
    }
};

module.exports = { handleS3Event };