



const multer = require('multer');
const fs=require('fs')
const path = require('path')
const webp=require('webp-converter');
const storage=multer.diskStorage({
    destination:function(req,res,cb){
      
        cb(null,'/var/www/html/Soulipie/Soulipie/sollipie/beforecompress/Chat/image/')
    },
    filename:(req,file,cb)=>{
	var name=file.fieldname+"_"+Date.now()+path.extname(file.originalname)
       
	console.log(file)
	
	cb(null,name)

    }
})
const upload1=multer({
    storage:storage,
    fileFilter:function(req,file,cb){
        if(file.mimetype==='image/png'||file.mimetype==='image/jpg'||file.mimetype==='image/jpeg'){
            cb(null,true)
        }else{
            console.log('only jpg & png file supported');
            cb(null,false)
        }
    },
  
})

  var compressGalleryImages = async (req, res, next) => {
    try {
      for (let file of req.files) {
        let result;
        if (file) {
          
          if (file.mimetype === 'image/heic' || file.mimetype === 'image/HEIC') {
            let output_path = "/var/www/html/Soulipie/Soulipie/sollipie/aftercompress/Chat/image/" + file.filename
            const inputBuffer = await promisify(fs.readFile)(file.path);
            const outputBuffer = await convert({
              buffer: inputBuffer, 
              format: 'JPEG',      
              quality: 0.5         
            });
            await promisify(fs.writeFile)(output_path, outputBuffer);
          } else {
            var output_path = "/var/www/html/Soulipie/Soulipie/sollipie/aftercompress/Chat/image/" + file.filename
            result = await webp.cwebp(file.path, output_path, "-q 80", logging = "-v")
            console.log(result)
          }
        }
      }
      next();
    } catch (error) {
      next()
      console.log(error);
    }
  }
  


 module.exports={upload1,compressGalleryImages}
