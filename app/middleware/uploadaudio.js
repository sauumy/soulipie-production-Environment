const AWS = require('aws-sdk');
const multer = require('multer');
const uploadAudioToS3 = multer();
const s3 = new AWS.S3({
  accessKeyId: 'AKIA4QQEYOZ2PG7KBFO4',
  secretAccessKey: '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',
  region: 'ap-south-1'
});

const uploadAudioToS3Bucket = async (req, res, next) => {
  try {
    const file = req.file;
    const originalName = file.originalname;
    const extension = originalName.split('.').pop(); // extract the file extension
    const timestamp = Date.now(); // get the current timestamp

    const params = {
      Bucket: 'soulipieappbucket2',
      Key: `audios/audio_${timestamp}.${extension}`, // format the Key parameter with the prefix and timestamp
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


// const AWS = require('aws-sdk');
// const multer = require('multer');
// const uploadAudioToS3 = multer();
// const s3 = new AWS.S3({
//   accessKeyId: 'AKIA3BU5MVVZR3OTTNUO',
//   secretAccessKey: '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',
//   region: 'ap-south-1'
// });

// const uploadAudioToS3Bucket = async (req, res, next) => {
//   try {
//     const file = req.file;
//     const originalName = file.originalname;

//     const params = {
//       Bucket: 'soulipiebucket2',
//       Key: `audios/${originalName}`,
//       Body: file.buffer,
//       ContentType: file.mimetype,
//     };

//     const data = await s3.upload(params).promise();
//     req.file.filename = data.Key.replace('audios/', '');
//     next();
//   } catch (error) {
//     next(error);
//   }
// };

// module.exports = { uploadAudioToS3, uploadAudioToS3Bucket };



// module.exports = { uploadAudioToS3, uploadAudioToS3Bucket };

