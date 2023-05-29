
const express = require('express');
require('dotenv').config()
const bodyParser = require('body-parser');
const multer = require('multer');
const ffmpeg = require('@ffmpeg-installer/ffmpeg');
const FFmpeg = require('fluent-ffmpeg');
FFmpeg.setFfmpegPath(ffmpeg.path);
const app=express()
app .use(express.json());
app.use(bodyParser.json({limit: '70mb'}));
app.use(bodyParser.urlencoded({limit: '70mb', extended: false, parameterLimit: 1000000}));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,DELETE,OPTIONS,PATCH,POST");
    res.header("Access-Control-Allow-Headers", "Multipart/form-data");
    next();
  });
 
const http=require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);
//const path=require('path');
//const staticPath=path.join(__dirname,'/public');
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');
// app.use(express.static(staticPath))
// app.get('', function(req, res,next) {  
//     res.sendFile(__dirname + "/public/index.html");
// });
let usersJoin={}
io.on('connection',(socket)=>{
  
    socket.on('joinRoom',(room)=>{
       
        socket.join(room);
	 if(!usersJoin[socket.id]){
             usersJoin[socket.id]=room
          }
    io.to(room).emit("online message",[socket.id],{online:true})
     })
     socket.on('online message',(room)=>{
                io.to(room).emit('online message1',{ online: true, time: new Date().toLocaleTimeString() })
                 })
                 socket.on('typing', (data) => {
                    io.to(data.room).emit('typing',data, socket.id);
                  });
                  socket.on('stopTyping', (data) => {
                  
                    io.to(data.room).emit('stopTyping', data,socket.id);
                  });
                
            socket.on('message',(data)=>{
        		  
                  io.to(data.room_id).emit('messageSend',{ ...data, time: new Date().toLocaleTimeString() })
               })
        
            socket.on('getmessage',(data)=>{
              
                io.to(data.room_id).emit('getmessage',{ ...data, time: new Date().toLocaleTimeString() })
        }) 
        socket.on('user video',data=>{
          
            io.to(data.room_id).emit('user video',{ ...data, time: new Date().toLocaleTimeString() })
        })
            socket.on('user image',data=>{
               
                io.to(data.room_id).emit('user image',{ ...data, time: new Date().toLocaleTimeString() })
            }) 
            
            socket.on('user audio',data=>{
                
                io.to(data.room_id).emit('user audio',{ ...data, time: new Date().toLocaleTimeString() })
            })
	
socket.on('disconnect',()=>{
    let id=usersJoin[socket.id];
    let time = new Date().toLocaleString();
   
    delete usersJoin[socket.id];
    io.emit('userLeft', {id, time});
 });
})
mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Databse Connected Successfully!!");    
}).catch(err => {
    console.log('Could not connect to the database', err);
    process.exit();
});
const route =require('./app/routers/index');
const databaseConfig = require('./config/database.config.js');
app.use('/', route);

// app.get('/', (req, res) => {
//     res.json({"message": "This is for testing"});
// });

server.listen(4000,()=>
{
    console.log("listening port 4000");
});

