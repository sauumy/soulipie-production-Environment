const AWS = require('aws-sdk');
const multer = require('multer');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const { promisify } = require('util');
const concat = require('concat-stream');

const uploadVideoStory = multer()

const s3 = new AWS.S3({
  accessKeyId: 'AKIA3BU5MVVZR3OTTNUO',
  secretAccessKey: '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',
  region: 'ap-south-1'
});


const compressVideoStroy = async (req, res, next) => {
  try {
    const originalBucketName = 'soulipiebucket1';
    const compressedBucketName = 'soulipiebucket2';

    const originalFiles = req.files;
    const compressedFiles = [];

    for (const originalFile of originalFiles) {
      const originalKey = `videos/${originalFile.fieldname}_${Date.now()}${path.extname(originalFile.originalname)}`;

      const uploadParams = {
        Bucket: originalBucketName,
        Key: originalKey,
        Body: originalFile.buffer,
        ContentType: originalFile.mimetype,
      };
      const originalUploadResult = await s3.upload(uploadParams).promise();
      const originalVideoPath = originalUploadResult.Key.replace('videos/', '');

      const compressedKey = `${originalKey}`;
      const compressedVideoPath = compressedKey.replace('videos/', '');

      const outputBuffer = async (inputBuffer) => {
        return new Promise((resolve, reject) => {
          ffmpeg(inputBuffer)
            .videoCodec('libx264')
            .audioCodec('aac')
            .format('mp4')
            .outputOptions('-crf 28')
            .on('error', (err) => {
              console.log('An error occurred: ' + err.message);
              reject(err);
            })
            .on('end', (stdout, stderr) => {
              resolve(stdout);
            })
            .toBuffer();
        });
      };

      const compressedParams = {
        Bucket: compressedBucketName,
        Key: compressedKey,
        Body: outputBuffer,
        ContentType: 'video/mp4',
      };
      await s3.upload(compressedParams).promise();

      compressedFiles.push(compressedVideoPath);
    }

    req.compressedVideoPaths = compressedFiles;
    next();
  } catch (error) {
    next(error);
  }
};




module.exports = { uploadVideoStory, compressVideoStroy };
