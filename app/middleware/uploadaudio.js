


// const AWS = require('aws-sdk');
// const multer = require('multer');
// const { v4: uuidv4 } = require('uuid');

// const uploadAudioToS3 = multer({
//   storage: multer.memoryStorage(),
//   fileFilter: function (req, file, cb) {
//     if (file.mimetype === 'audio/mpeg' || file.mimetype === 'audio/mp4' || file.mimetype === 'audio/mid' || file.mimetype === 'audio/basic' || file.mimetype === 'audio/x-aiff' || file.mimetype === 'audio/vnd.rn-realaudio' || file.mimetype === 'audio/x-aiff' || file.mimetype === 'audio/opus' || file.mimetype === 'audio/ogg' || file.mimetype === 'audio/m4a') {
//       cb(null, true)
//     }
//     else {
//       console.log('Only audio files are allowed');
//       cb(null, false)
//     }
//   }
// });

// const s3 = new AWS.S3({
//   accessKeyId: 'AKIA3BU5MVVZR3OTTNUO',
//   secretAccessKey: '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',
//   region: 'ap-south-1'
// });
// const uploadAudioToS3Bucket = (req, res, next) => {
//   try {
//     const bucketName = 'soulipiebucket2';
//     const audioFile = req.file;
//     const audioId = uuidv4(); // create unique ID for the audio file

//     const params = {
//       Bucket: bucketName,
//       Key: `${audioId}-${audioFile.originalname}`,
//       Body: audioFile.buffer,
//       ContentType: audioFile.mimetype
//     };

//     s3.upload(params, function (err, data) {
//       if (err) {
//         console.log('Error uploading audio file to S3 bucket', err);
//         return res.status(500).send({ message: 'Error uploading audio file to S3 bucket' });
//       } else {
//         console.log('Audio file uploaded successfully to S3 bucket');
//         req.audioUrl = data.Location; // store the S3 file URL in the request object for later use
//         next();
//       }
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send({ message: 'Error uploading audio file to S3 bucket' });
//   }
// };
const AWS = require('aws-sdk');
const multer = require('multer');
const uploadAudioToS3 = multer();
const s3 = new AWS.S3({
  accessKeyId: 'AKIA3BU5MVVZR3OTTNUO',
  secretAccessKey: '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',
  region: 'ap-south-1'
});

const uploadAudioToS3Bucket = async (req, res, next) => {
  try {
    const file = req.file;
    const originalName = file.originalname;

    const params = {
      Bucket: 'soulipiebucket2',
      Key: `audios/${originalName}`,
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



// module.exports = { uploadAudioToS3, uploadAudioToS3Bucket };

