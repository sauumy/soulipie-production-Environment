const AWS = require('aws-sdk');
const sharp = require('sharp');
const { promisify } = require('util');
const multer = require('multer');
const path = require('path')
const uploadHobbies= multer()

const s3 = new AWS.S3({
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
  region: process.env.region
});
const compressHobbiesImg = async (req, res, next) => {
  try {
    const originalBucketName = process.env.bucket1;
    const compressedBucketName = process.env.bucket2;
    const originalFile = req.file;
    const originalKey = `images/${originalFile.fieldname}_${Date.now()}${path.extname(originalFile.originalname)}`

    const params = {
      Bucket: originalBucketName,
      Key: originalKey,
      Body: originalFile.buffer,
      ContentType: originalFile.mimetype,
    };
    const originalUploadResult = await s3.upload(params).promise();
    const originalImagePath = originalUploadResult.Key.replace('images/', '');

    const compressedFiles = [];

    let result;
    if (originalFile) {
      const inputBuffer = originalFile.buffer;
      let outputBuffer;
      let contentType;

      if (originalFile.mimetype === 'image/heic' || originalFile.mimetype === 'image/HEIC') {
        outputBuffer = await sharp(inputBuffer).jpeg({ quality: 50 }).toBuffer();
        contentType = 'image/jpeg';
      } else {
        outputBuffer = await sharp(inputBuffer).webp({ quality: 80 }).toBuffer();
        contentType = 'image/webp';
      }

      const compressedKey = `${originalKey}`;
      const params = {
        Bucket: compressedBucketName,
        Key: compressedKey,
        Body: outputBuffer,
        ContentType: contentType,
      };
      await s3.upload(params).promise();
      compressedFiles.push(compressedKey.replace('images/', ''));
    }

    req.compressedFiles = compressedFiles;
    req.file.filename = originalImagePath;
    next();
  } catch (error) {
    next();
  
  }
};


module.exports ={uploadHobbies,compressHobbiesImg};






