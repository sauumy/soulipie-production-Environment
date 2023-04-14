const multer = require('multer');
const express = require('express');
const fs = require('fs')
const path = require('path');

const ffmpeg = require('@ffmpeg-installer/ffmpeg');
const FFmpeg = require('fluent-ffmpeg');
FFmpeg.setFfmpegPath(ffmpeg.path);

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      var dir = '/var/www/html/Soulipie/Soulipie/sollipie/beforecompress/Chat/video/'
        cb(null, dir);
    },

    filename: function (req, file, cb) {
      cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname));
    }

 });
 
var uploadVideoStory = multer({ storage: storage });

const compressVideoStroy = async (req, res, next) => {
    try {
      const compressedFiles = [];
  
      for (const file of req.files) {
        const inputFile = file.path;
        const outputFile = '/var/www/html/Soulipie/Soulipie/sollipie/aftercompress/Chat/video/' + file.filename + '.webm';
  
        await new Promise((resolve, reject) => {
          FFmpeg(inputFile)
            .videoCodec('libvpx')
            .audioCodec('libvorbis')
            .format('webm')
            .on('error', (err) => {
              console.log('An error occurred: ' + err.message);
              reject(err);
            })
            .on('progress', (progress) => {
              console.log('... frames: ' + progress.frames);
            })
            .on('end', () => {
              console.log('Finished processing');
              compressedFiles.push(outputFile);
              resolve();
            })
            .save(outputFile);
        });
      }
  
      req.compressedVideo = compressedFiles; 
      next();
    } catch (error) {
      next(error);
      console.log(error);
    }
  };

module.exports =  {uploadVideoStory,compressVideoStroy}
