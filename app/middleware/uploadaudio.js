const AWS = require('aws-sdk');
const multer = require('multer');
const uploadAudioToS3 = multer();
const s3 = new AWS.S3({
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
  region: process.env.region
});

const uploadAudioToS3Bucket = async (req, res, next) => {
  try {
    const file = req.file;
    const originalName = file.originalname;
    const extension = originalName.split('.').pop(); 
    const timestamp = Date.now(); 

    const params = {
      Bucket: process.env.bucket2,
      Key: `audios/audio_${timestamp}.${extension}`, 
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    const data = await s3.upload(params).promise();
    req.file.filename = data.Key.replace('audios/', '');
    next();
  } catch (error) {
    next(error);
  }
};
module.exports = { uploadAudioToS3, uploadAudioToS3Bucket };



