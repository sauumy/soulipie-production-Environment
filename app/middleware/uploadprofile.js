const multer = require('multer');
const fs=require('fs')
const path = require('path')
const webp=require('webp-converter');
const storage=multer.diskStorage({
    destination:function(req,res,cb){
       // const dir = 'Hiddenly/Media/Profile_Img/'
       /* if(!fs.existsSync(dir))
        {
            fs.mkdirSync(dir,{
                recursive:true
            })
        }*/
        cb(null,'/var/www/html/Soulipie/Soulipie/sollipie/beforecompress/profile_Img/')
    },
    filename:(req,file,cb)=>{
	var name=file.fieldname+"_"+Date.now()+path.extname(file.originalname)
       // cb(null,name)
	console.log(file)
	//var output_path="/hiddenly/Hiddenly/webp/profile/"+name
        //webp.cwebp(file.filename,output_path,"-q 50", logging="-v")
	cb(null,name)

    }
})
const uploadProfile=multer({
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
    var compressProfileImg=async(req,res,next)=>{
    let result;
      if(req.file){
            //console.log("_______________________________________________",req.file.path)
	if(req.file.mimetype==='image/heic' || req.file.mimetype==='image/HEIC'){
              let output_path='/var/www/html/Soulipie/Soulipie/sollipie/aftercompress/profile_Img/'+req.file.filename
	      const inputBuffer = await promisify(fs.readFile)(req.file.path);
	      const outputBuffer = await convert({
		      buffer: inputBuffer, // the HEIC file buffer
	              format: 'JPEG',      // output format
		      quality: 0.5          // the jpeg compression quality, between 0 and 1
                     });
              await promisify(fs.writeFile)(output_path,outputBuffer);
              next();
        }else{
             var output_path='/var/www/html/Soulipie/Soulipie/sollipie/aftercompress/profile_img/'+req.file.filename
             result=await webp.cwebp(req.file.path,output_path,"-q 40", logging="-v")
        //
        //webp.cwebp()
            console.log(result)
            next()
        }
      }
	else{
	     next()
	  }
    }





 module.exports={uploadProfile,compressProfileImg}
