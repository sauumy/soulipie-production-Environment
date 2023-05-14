// const express = require('express');
// require('dotenv').config()
// const bodyParser = require('body-parser');
// const multer = require('multer');


// const app=express()
// app .use(express.json());

// app.use(bodyParser.json({limit: '70mb'}));
// app.use(bodyParser.urlencoded({limit: '70mb', extended: false, parameterLimit: 1000000}));

// app.use(function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Methods", "GET,PUT,DELETE,OPTIONS,PATCH,POST");
//     res.header("Access-Control-Allow-Headers", "Multipart/form-data");
//     next();
//   });
//   const http=require('http');
//   const server = http.createServer(app);
//   const io = require('socket.io')(server);
//   const path=require('path');
//   const staticPath=path.join(__dirname,'/public');
// //   const dbConfig = require('./config/database.config.js');
// //   const mongoose = require('mongoose');
//   app.use(express.static(staticPath))
//   app.get('', function(req, res,next) {  
//       res.sendFile(__dirname + "/public/index.html");
//   });
//   let usersJoin={}
//   io.on('connection',(socket)=>{
//       console.log("A user connected=",socket.id);
//       socket.on('joinRoom',(room)=>{
//           console.log("joing for room is ",room)
//           socket.join(room);
//        if(!usersJoin[socket.id]){
//                usersJoin[socket.id]=room
//             }io.to(room).emit("online message",{online:true})
//         })
// 	socket.on('online message',(room)=>{
//         io.to(room).emit('online message1',{ online: true, time: new Date().toLocaleTimeString() })
//          })
//          socket.on('typing', (data) => {
//             io.to(data.room).emit('typing',data, socket.id);
//           });
//           socket.on('stopTyping', (data) => {
//             console.log("User stopped typing: ", data);
//             io.to(data.room).emit('stopTyping', data,socket.id);
//           });
        
//     socket.on('message',(data)=>{
// 		  console.log('socket message1',data)
//           io.to(data.room_id).emit('messageSend',{ ...data, time: new Date().toLocaleTimeString() })
//        })

//     socket.on('getmessage',(result)=>{
//         console.log('socket message1',data)
//         io.to(data.room_id).emit('getmessage',{ ...data, time: new Date().toLocaleTimeString() })
// }) 
// socket.on('user video',data=>{
//     console.log("image",data.result.room_id)
//     io.to(data.room_id).emit('user video',{ ...data, time: new Date().toLocaleTimeString() })
// })
//     socket.on('user image',data=>{
//         console.log("image",data.result.room_id)
//         io.to(data.room_id).emit('user image',{ ...data, time: new Date().toLocaleTimeString() })
//     }) 
    
//     socket.on('user audio',data=>{
//         console.log("image",data.result.room_id)
//         io.to(data.room_id).emit('user audio',{ ...data, time: new Date().toLocaleTimeString() })
//     })
// socket.on('disconnect',()=>{
//     let id=usersJoin[socket.id];
//     let time = new Date().toLocaleString();
//     console.log('user left',id, time);
//     delete usersJoin[socket.id];
//     io.emit('userLeft', {id, time});
//  });
// })

// const dbConfig = require('./config/database.config.js');
// const mongoose = require('mongoose');


// mongoose.Promise = global.Promise;
// mongoose.connect(dbConfig.url, {
//     useNewUrlParser: true
// }).then(() => {
//     console.log("Databse Connected Successfully!!");    
// }).catch(err => {
//     console.log('Could not connect to the database', err);
//     process.exit();
// });
// const route =require('./app/routers/index')
// app.use('/', route);

// app.get('/', (req, res) => {
//     res.json({"message": "This is for testing"});
// });

// app.listen(4000,()=>
// {
//     console.log("listening port 4000");
// });

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
  app.use('/healthcheck', require('./app/routers/healthcheck'));
const http=require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);
const path=require('path');
const staticPath=path.join(__dirname,'/public');
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');
app.use(express.static(staticPath))
app.get('', function(req, res,next) {  
    res.sendFile(__dirname + "/public/index.html");
});
let usersJoin={}
io.on('connection',(socket)=>{
    console.log("A user connected=",socket.id);
    socket.on('joinRoom',(room)=>{
        console.log("joing for room is ",room)
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
                    console.log("User stopped typing: ", data);
                    io.to(data.room).emit('stopTyping', data,socket.id);
                  });
                
            socket.on('message',(data)=>{
        		  console.log('socket message1',data)
                  io.to(data.room_id).emit('messageSend',{ ...data, time: new Date().toLocaleTimeString() })
               })
        
            socket.on('getmessage',(data)=>{
                console.log('socket message1',data)
                io.to(data.room_id).emit('getmessage',{ ...data, time: new Date().toLocaleTimeString() })
        }) 
        socket.on('user video',data=>{
            console.log("image",data)
            io.to(data.room_id).emit('user video',{ ...data, time: new Date().toLocaleTimeString() })
        })
            socket.on('user image',data=>{
                console.log("image",data)
                io.to(data.room_id).emit('user image',{ ...data, time: new Date().toLocaleTimeString() })
            }) 
            
            socket.on('user audio',data=>{
                console.log("image",data)
                io.to(data.room_id).emit('user audio',{ ...data, time: new Date().toLocaleTimeString() })
            })
	
socket.on('disconnect',()=>{
    let id=usersJoin[socket.id];
    let time = new Date().toLocaleString();
    console.log('user left',id, time);
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

app.get('/', (req, res) => {
    res.json({"message": "This is for testing"});
});

server.listen(4000,()=>
{
    console.log("listening port 4000");
});

