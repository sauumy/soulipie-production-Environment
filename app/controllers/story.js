
const story = require ('../models/story')
const usermaster=require('../models/registration')

exports.addstoryImage = async (req, res) => {
    try{
        
        if (req.files && req.files.length > 0) {
            const pic = req.files.map(file => file.filename);
            const sender_id = req.body.sender_id;
            const text = req.body.text;
            const currenttime=new Date()
           currenttime.setHours(currenttime.getHours() + 24) 
           const storyDocs = pic.map(p => new story({
              sender_id,
              text,
              pic: p,
              deleteTime:currenttime
            }));
            const result = await story.insertMany(storyDocs);
            return res.status(200).json({Status:true,message:"story created successfully",result})
            }
    
        else{
            return res.status(406).json({Status:false,message:"Please choose img"})
        }
     }catch(err){
        console.log('err',err.message);
        const Error={}
        if(err.message.includes(' validation failed')){
            Object.values(err.errors).forEach(properties=>{
                    Error[properties.path]=properties.message
            })
        }
        return res.status(400).json({Status:'Error',Error})
     } 
};
exports.addstoryVideo = async (req, res) => {
    try{
       
        if (req.files && req.files.length > 0) {
            const video = req.files.map(file => file.filename);
            const sender_id = req.body.sender_id;
            const text = req.body.text;
            const currenttime=new Date()
            currenttime.setHours(currenttime.getHours()+24)
            const storyDocs = video.map(v => new story({
              sender_id,
              text,
              video: v,
              deleteTime:currenttime
            }));
            const result = await story.insertMany(storyDocs);
            return res.status(200).json({Status:true,message:"story created successfully",result})
        }
        else{
            return res.status(406).json({Status:false,message:"Please choose img"})
        }
     }catch(err){
        console.log('err',err.message);
        const Error={}
        if(err.message.includes(' validation failed')){
            Object.values(err.errors).forEach(properties=>{
                    Error[properties.path]=properties.message
            })
        }
        return res.status(400).json({Status:'Error',Error})
     } 
};
exports.getstory = async (req, res) => {
    try {
        const{sender_id}=req.body
        const user = await story.find({sender_id:sender_id});
        res.status(200).send({Status:true,message:"story fetched successfully",user});
    } catch(error) {
        res.status(404).json({ message: error.message});
    }
};


exports.getAllStory=async(req,res)=>{
    try{

        const user = await story.find();
        res.status(200).send({Status:true,message:"story fethed successfully",user});

    }catch(error) {
        res.status(404).json({ message: error.message});
    }
}

exports.updateViewers = async(req,res) =>{
    try{
       const {seenuser_id,_id} = req.body
       console.log(seenuser_id,_id);
       if(!_id || !seenuser_id){
           return res.status(406).json({message:'user_id and status_id are required field'})
       }else{
          const status= await story.findOne({_id:_id})
     
        if(status){
            const response= await story.findOneAndUpdate({_id:_id},{$push:{viewers:{$each:seenuser_id}}})
            const numbers=response.viewers
            if(response){
                const respond=await story.findOne({_id:_id})
                const count = respond.viewers;

                const uniqueViewers = new Set(count);
                const totalcount = uniqueViewers.size;
                console.log(totalcount);
                const counts = count.reduce((acc, curr) => {
                    acc[curr] ? acc[curr]++ : (acc[curr] = 1);
                    return acc;
                  }, {});
                  console.log(counts);
               const totalviewers=await story.findOneAndUpdate({_id:_id},{totalViewers:totalcount})
               console.log(totalcount,totalviewers)
               if(totalcount,totalviewers){
               const resul=await story.findOne({_id:_id})
                
                const data=await usermaster.find({_id:numbers},{_id:1,profile_img:1,name:1})
                console.log(data)
                const result = {
                    ...resul.toObject(),
                    viwerDetails: data.map(d => d.toObject())
                  };
                  
                  console.log(result);
              
              console.log(result);
                return res.status(200).json({Status:true,message:"story fetched  successfully",result})
               }else{
                return res.status(406).json({message:'no views yet'})
               }
            }else{
                return res.status(406).json({message:'error while updating the view'})
            }
        }else{
            return res.status(406).json({message:'coulnt find any status'})
           }

    }
}catch(err){
        console.log(err);
        return res.status(400).json({message:"somthing went wrong"})
    }
}

exports.deleteStory=async(req,res)=>{
    try{
        const {_id}=req.body
        const user = await story.findOneAndDelete({_id:_id});
        res.status(200).send({Status:true,message:"story deleted successfully",user});

    }catch(error) {
        res.status(404).json({ message: error.message});
    }
}


