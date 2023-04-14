const multer = require('multer');
const path = require('path')
const fs=require('fs');
const storage=multer.diskStorage({
    destination: function (req, file, cb) {
      const dir='/var/www/html/Soulipie/Soulipie/sollipie/aftercompress/Chat/audio/';
      if(!fs.existsSync(dir)){
        fs.mkdirSync(dir,{
          recursive:true
        })
      }
        cb(null,dir) 
    },
    filename:(req,file,cb)=>{
        cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname))
    }
})

const uploadAuido=multer({
    storage:storage,
    fileFilter:function(req,file,cb){
        if(file.mimetype==='audio/mpeg' ||file.mimetype==='audio/mp4'||file.mimetype==='audio/mid'|| file.mimetype==='audio/basic'
           || file.mimetype==='audio/x-aiff' || file.mimetype==='audio/vnd.rn-realaudio' ||file.mimetype==='audio/x-aiff'||file.mimetype==='audio/opus'||file.mimetype==='audio/ogg'||
           file.mimetype==='audio/m4a' )
           {
            cb(null,true)
           }
           else{
               console.log('Only Audio support');
               cb(null,false)
           }
    }
});
module.exports=uploadAuido
