const AWS = require('aws-sdk');
const sharp = require('sharp');
const { promisify } = require('util');
const multer = require('multer');
const path = require('path')
const uploadimagestory= multer()

  const s3 = new AWS.S3({
    accessKeyId: 'AKIA3BU5MVVZR3OTTNUO',
    secretAccessKey: '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',
    region: 'ap-south-1'
  });


const compressedImgstory = async (req, res, next) => {
  try {
    const originalBucketName = 'soulipiebucket1';
    const compressedBucketName = 'soulipiebucket2';

    const originalFiles = req.files;
    const compressedFiles = [];

    for (const originalFile of originalFiles) {
      const originalKey = `images/${originalFile.fieldname}_${Date.now()}${path.extname(originalFile.originalname)}`

      const uploadParams = {
        Bucket: originalBucketName,
        Key: originalKey,
        Body: originalFile.buffer,
        ContentType: originalFile.mimetype,
      };
      const originalUploadResult = await s3.upload(uploadParams).promise();
      const originalImagePath = originalUploadResult.Key.replace('images/', '');

      let outputBuffer;
      let contentType;

      if (originalFile.mimetype === 'image/heic' || originalFile.mimetype === 'image/HEIC') {
        outputBuffer = await sharp(originalFile.buffer).jpeg({ quality: 50 }).toBuffer();
        contentType = 'image/jpeg';
      } else {
        outputBuffer = await sharp(originalFile.buffer).webp({ quality: 80 }).toBuffer();
        contentType = 'image/webp';
      }

      const compressedKey = `${originalKey}`;
      const compressedParams = {
        Bucket: compressedBucketName,
        Key: compressedKey,
        Body: outputBuffer,
        ContentType: contentType,
      };
      await s3.upload(compressedParams).promise();
      compressedFiles.push(compressedKey.replace('images/', ''));
    }

    req.compressedFiles = compressedFiles;
    req.files.forEach((file, index) => file.filename = compressedFiles[index]);
    next();
  } catch (error) {
    next();
    console.log(error);
  }
};

 
 module.exports = { uploadimagestory, compressedImgstory };
 
