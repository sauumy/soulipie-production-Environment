const multer = require('multer');
const fs=require('fs')
const path = require('path')
const webp=require('webp-converter');
const storage=multer.diskStorage({
    destination:function(req,res,cb){
   
        cb(null,'/var/www/html/Soulipie/Soulipie/sollipie/beforecompress/Hobbies_Img/')
    },
    filename:(req,file,cb)=>{
	var name=file.fieldname+"_"+Date.now()+path.extname(file.originalname)
       
	console.log(file)
	
	cb(null,name)

    }
})
const uploadHobbies=multer({
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
    var compressHobbiesImg=async(req,res,next)=>{
    let result;
      if(req.file){
           
	if(req.file.mimetype==='image/heic' || req.file.mimetype==='image/HEIC'){
              let output_path='/var/www/html/Soulipie/Soulipie/sollipie/aftercompress/Hobbies_Img/'+req.file.filename
	      const inputBuffer = await promisify(fs.readFile)(req.file.path);
	      const outputBuffer = await convert({
		      buffer: inputBuffer, 
	              format: 'JPEG',      
		      quality: 0.5          
                     });
              await promisify(fs.writeFile)(output_path,outputBuffer);
              next();
        }else{
             var output_path='/var/www/html/Soulipie/Soulipie/sollipie/aftercompress/Hobbies_Img'+req.file.filename
             result=await webp.cwebp(req.file.path,output_path,"-q 40", logging="-v")
     
            console.log(result)
            next()
        }
      }
	else{
	     next()
	  }
    }





 module.exports={uploadHobbies,compressHobbiesImg}
