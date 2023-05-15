const {chatModule}=require('../models/chatmodule')
const usermaster=require('../models/registration')
const {v4 : uuidv4} = require('uuid')
const connection=require('../models/connection')
const storeMsg=require('../models/storemssage')
const report=require('../models/report')


exports.getConnections=async(req,res)=>{
    try{
        const {_id}=req.body
        const result= await connection.find({user_id:_id},{_id:0,connections:1});
        if( result.length!=0)
        {
            res.send({status:true,message:"Get Data Succesfully",result})
        }
        else{
            res.status(401).send({message:"No Any data available"})
        }
    }
    catch(err)
    {
        res.send({message:"somthing is wrong"})
    }
}

exports.createChat=async(req,res)=>{
    try{
      const {sender_id,other_id}=req.body
      if(!sender_id|| !other_id){
          res.send({ErrorMessage:"Please Before Provide user_id and other_id"})
         }
      else{
        const isuser = await usermaster.findOne({ _id: sender_id })
        const isotherUser = await usermaster.findOne({ _id: other_id })
        const isuserblocked = isuser.blockContact.includes(other_id);
        const isotheruserblocked = isotherUser.blockContact.includes(sender_id);
          console.log(isuserblocked,isotheruserblocked)
          if(isuserblocked||isotheruserblocked){
            res.send({status:false,Message: "Blocked Contact, cannot createChat" })
          }else{
        const isuserprivate=isuser.public
        const isotheruserprivate=isotherUser.public
        const data=await connection.findOne({sender_id:sender_id})
        const isuserconnected=data?.connections?.map(connection => connection._id) || []
        const data1=await connection.findOne({user_id:other_id})
        const isotherconnected=data1?.connections?.map(connection => connection._id) || []
        console.log(isuserconnected,isotherconnected)

        const connectuserStr = isuserconnected.map(id => id.toString());
        console.log(connectuserStr);
        const connectotherStr = isotherconnected.map(id => id.toString());
        console.log(connectotherStr);
        
        if (isuser.private===true || isotherUser.private===true) {
          res.send({status:false,Message: "Cannot create chat with private user" })
        }else if (connectuserStr.includes(sender_id)||connectuserStr.includes(other_id)||
        connectotherStr.includes(sender_id)||connectotherStr.includes(other_id)){
	 console.log(sender_id,typeof sender_id ,other_id,typeof other_id)
	if(sender_id.length>10){
           let l = sender_id.length 
           if(l===12){
            sender_id = sender_id.substring(2)
           }
           else if(l===13){
            sender_id = sender_id.substring(3)
           }
        }
        if(other_id.length>10){
            let l = other_id.length 
            if(l===12){
                other_id = other_id.substring(2)
            }
            else if(l===13){
                other_id = other_id.substring(3)
            }
        }
	console.log(other_id,sender_id)
        var response=await chatModule.find({
              $or:[{sender_id:sender_id,other_id:other_id},{sender_id:other_id,other_id:sender_id}]
        });
        if(response.length!=0){
	   console.log(response)
            res.status(200).send({status:"Success",message:"room created",response})
        }

        else{
           const room_id=uuidv4()
           const user=new chatModule({
            sender_id:sender_id,
            other_id:other_id,
            room_id:room_id.toString()
           })
          const result=await user.save();
           if(result)
           {
		console.log(result)
		let response=[result]
                res.send({status:"Success",message:"room created",response})
           }
           else{
               res.send({ErrorMessage:"some technical issue"})
           }
        }
      }else if(isotheruserprivate===true&&isuserprivate===true) {
    
            console.log(sender_id,typeof sender_id ,other_id,typeof other_id)
           if(sender_id.length>10){
                  let l = sender_id.length 
                  if(l===12){
                    sender_id = sender_id.substring(2)
                  }
                  else if(l===13){
                    sender_id = sender_id.substring(3)
                  }
               }
               if(other_id.length>10){
                   let l = other_id.length 
                   if(l===12){
                    other_id = other_id.substring(2)
                   }
                   else if(l===13){
                    other_id = other_id.substring(3)
                   }
               }
           console.log(other_id,sender_id)
               var response=await chatModule.find({
                     $or:[{sender_id:sender_id,other_id:other_id},{sender_id:other_id,other_id:sender_id}]
               });
               if(response.length!=0){
              console.log(response)
                   res.status(200).send({status:"Success",message:"room created",response})
               }
       
               else{
                  const room_id=uuidv4()
                  const user=new chatModule({
                    sender_id:sender_id,
                   other_id:other_id,
                   room_id:room_id.toString()
                  })
                 const result=await user.save();
                  if(result)
                  {
               console.log(result)
               let response=[result]
                       res.send({status:"Success",message:"room created",response})
                  }
                  else{
                      res.send({ErrorMessage:"some technical issue"})
                  }
               }
      }else{
        return res.status(400).send({status:false,Message:"your not connected to chat with user"})
      }
    }

  }
}catch(err){
        console.log("room err",err)
        return res.status(400).send({ErrorMessage:"somthing error"})
    }
} 



exports.Message=async(req,res)=>{
    try{
        const otherid=req.body.sender_id
        const name=req.body.senderName
        const msg=req.body.msg
        const roomid=req.body.room_id
	if(!otherid ||!name || !roomid){
		res.status(406).json({message:"sender_id ,senderName,room_id"})
	}
	else{
          const store=storeMsg({
            sender_id:otherid,
            senderName:name,
            message:msg,
            room_id:roomid,
            image:'',
	    video:'',
	    audio:''
        })
        const result= await store.save();
        if(result)
        {
            const data=await chatModule.findOne({room_id:roomid})
            console.log(data)
            if (data.sender_id === otherid) {
                const other_id = data.other_id;
                console.log('hi',other_id)
              } else {
                const other_id = data.sender_id;
                console.log('bye',other_id)
              }
            const notification = {
                title: `${name} Sent A meesage`,
                body: `${msg}`
              };
              const response=await admin.messaging().sendToDevice(token,{notification});
            return res.status(200).send({status:"Success",message:"Store Message Successfully",result})
        }else{
	  return res.status(400).json({stauts:"Success",message:"Some Technical Issue"})
	}
     }
    }
    catch(err){
        console.log(err)
        return res.status(400).send({ErrorMessage:"Somthing Wrong"})
    }
}

exports.getmessage=async(req,res)=>{
    try{
        const roomid=req.params.room_id
        
            const result=await storeMsg.find({room_id:roomid});
            if(result!=0){
                res.send({status:"Success",message:"Get All Data Successfully",result});
            
        }
    }catch(err){
         res.sen({ErrorMessage:"somthing error"})
    }
}

exports.image = async (req, res, next) => {
    try {
      console.log(req.files);
      if (req.files && req.files.length > 0) {
        const sender_id = req.body.sender_id;
        const senderName = req.body.senderName;
        const room_id = req.body.room_id;
        const message = req.body.message;
  
        const image=req.files.map(file => file.filename)
        const upload=image.map(i=> new storeMsg({
            sender_id,
            senderName,
            room_id ,
            message,
            image:i
        }))
        
        const result = await storeMsg.insertMany(upload);
        if(result){
            const data=await chatModule.findOne({room_id:roomid},{_id:0,sender_id:1,other_id:1})
          console.log(data)
          if (data.sender_id === otherid) {
              const other_id = data.other_id;
              console.log('hi',other_id)
              const tokens=await Users.findOne({_id:other_id},{_id:0 ,token:1})
              const token=tokens.token
              console.log(token)
              const notification = {
                title: `${name} Sent A meesage`,
                body: `${msg}`
                
              };
              const response=await admin.messaging().sendToDevice(token,{notification});
               
              res.send({status:"Success",message:"images are sent successfully",result,response})
            } else {
              const other_id = data.sender_id;
              console.log('bye',other_id)
              const tokens=await Users.findOne({_id:other_id},{_id:0 ,token:1})
              const token=tokens.token
              console.log(token)
              const notification = {
                title: `${name} Sent A meesage`,
                body: `${msg}`
              };  
              const response=await admin.messaging().sendToDevice(token,{notification});
              res.send({status:"Success",message:"images are sent successfully",result,response})
              
            }
         
        }
       
    }else{
        res.send({status:"faluier",message:"couldnt upload"})
    } 
}catch (err) {
    console.log(err)
      res.send({ ErrorMessage: "Something Error", err });
      
    }
  };
  
exports.video=async(req,res,next)=>{

    try{
        console.log(req.file)
        if(req.files && req.files.length > 0){
            const sender_id=req.body.sender_id
            const senderName=req.body.senderName
            const room_id=req.body.room_id
            const message=req.body.message
            const video=req.files.map(file => file.filename)
            const upload=video.map(v=> new storeMsg({
                sender_id,
                senderName,
                room_id ,
                message,
                video:v
            }))
            const result = await storeMsg.insertMany(upload);
          
            if(result)
            {
              const userdata=await chatModule.findOne({room_id:room_id},{_id:0,sender_id:1,other_id:1})
              console.log(userdata)
              const id=userdata.sender_id.toString()
              console.log(id)
              if (id === sender_id) {
                const tokens=await Users.findOne({_id:userdata.other_id},{_id:0 ,token:1})
                const token=tokens.token
                console.log(token)
                const notification = {
                  title: `Soulipie`,
                  body: `${senderName} Send A Video ${message}`,
                }
                  const data={
                    body: `${message}`
                  }
                const response=await admin.messaging().sendToDevice(token,{notification,data});
  
                return res.status(200).send({status:"Success",message:"Store Message Successfully",result,response})
              } else {
                const tokens=await Users.findOne({_id:userdata.sender_id},{_id:0 ,token:1})
                const token=tokens.token
                console.log(token)
                const notification = {
                  title: `Soulipie`,
                  body: `${senderName} Send A Video ${message}`,
                };
                const payload = {
                  notification: notification,
                  data: {
                    body: `${message}`,
                  }
                };
                const response=await admin.messaging().sendToDevice(token,payload);
                return res.status(200).send({status:"Success",message:"Store Message Successfullys",result,response})
              }
            }
        }
        else{
            res.send({ErrorMessage:'Please choose image and video file'})
        }
    }
    catch(err){
        res.send({ErrorMessage:"Somthing Error",err})
    }
}

exports.audio=async(req,res,next)=>{

    try{
        console.log(req.file)
        if(req.file){
            const otherid=req.body.sender_id
            const name=req.body.senderName
            const audio=req.file.filename
            const roomid=req.body.room_id
            const msg=req.body.message
            const store=storeMsg({
                sender_id:otherid,
                senderName:name,
                room_id:roomid,
                message:msg,
                audio:audio
            })
            const result= await store.save();
            if(result)
            {
                res.send({status:"Success",message:"Audio Uploaded Successfully",result})
            }
        }
        else{
            res.send({ErrorMessage:'Please choose Audio file'})
        saveLiveAudioFile        }
    }
    catch(err){
        res.send({ErrorMessage:"Somthing Error",err})
    }
}

  
exports.clearChat=(req,res)=>{
    
    const roomid=req.params.roomid
    storeMsg.deleteMany({room_id:roomid}).then(response=>{
        if(response){
            res.status(200).send({status:"Success",message:"All Chat are Clear",response})
        }
        else{
            res.send({message:"Not found Room id"})
        }
        }).catch(Error=>{
            res.status(401).send({status:"Failure",messaage:"somthing problem in clear chat"})
        })
    }

exports.deleteChat=async(req,res)=>{
    try{
        const roomid=req.params.roomid
        if(roomid){
        const result= await chatModule.findOneAndDelete({room_id:roomid})
        console.log(result)
        res.send({status:true,message:"room deleted successfully",result})

    }else{
        res.status(401).send({message:"can not be deleted pls check"})
    }
    
}catch(err)
{
    res.send({message:"somthing is wrong"})
    console.log(err)
}
}

exports.deleteOneManyMesage=async(req,res)=>{
    try{
    const{_id}=req.body
    if(!_id){
        return res.status(406).json({status:'Failure',message:'mobilenumber and are required field'})
    }else{

        const response=await storeMsg.deleteMany({_id:{$in:_id}})
        if(response){
            console.log(response)
            return res.status(200).send({status:'Success',message:'message deleted successfully',response})
        }else{
            return res.status(406).json({status:'Failure',message:'message couldnot be deleted'})
        }
    }
}catch(err){
    console.log(err);
    return res.status(400).json({status:'Error',message:'somthing went wrong',err})
}
}

// exports.messageHistory=async(req,res)=>{
//     var user_id = req.body.sender_id;
//     try{
//         const result= await chatModule.find({sender_id:{$eq:user_id}},{_id:0,room_id:1,other_id:1,sender_id:1})
      
//         const other_id1 = result.map(doc => doc.other_id);
     
//        const result5= await chatModule.find({other_id:{$eq:user_id}},{_id:0,room_id:1,sender_id:1})
      
//        const user_id1 = result5.map(doc => doc.user_id);
    
//       const roomIds3 = result5.map(doc => doc.room_id);
   

//         const roomIds = result.map(doc => doc.room_id);

// const result1Promise = chatModule.aggregate([
//     {
//       $match: {
//         other_id: { $in: other_id1 },
//         room_id: { $in: roomIds }
//       }
//     },
//     {
//       $lookup: {
//         from: "usermasters",
//         localField: "other_id",
//         foreignField: "_id",
//         as: "otherdata"
//       }
//     },
//     {
//       $lookup: {
//         from: "storemsgs",
//         localField: "room_id",
//         foreignField: "room_id",
//         as: "data"
//       }
//     }
//   ]);
//   console.log()
//   const result2Promise = chatModule.aggregate([
//     {
//       $match: {
//         user_id: { $in: user_id1 },
//         room_id: { $in: roomIds3 }
//       }
//     },
//     {
//       $lookup: {
//         from: "usermasters",
//         localField: "user_id",
//         foreignField: "_id",
//         as: "otherdata"
//       }
//     },
//     {
//       $lookup: {
//         from: "storemsgs",
//         localField: "room_id",
//         foreignField: "room_id",
//         as: "data"
//       }
//     }
//   ]);
  
//   const [result8, result9] = await Promise.all([result1Promise, result2Promise]);
  
//   const combinedResult = [...result8, ...result9];
//   console.log(combinedResult);
// const response=combinedResult
// if(response){
//   res.send({status:true,message:"Get Data Succesfully",response})
 
// }else{
//     res.status(400).send({message:"somthing is wrong",err})
// }

//   }  catch(err){
//     console.log(err);
//     return res.status(400).json({status:'Error',message:'somthing went wrong',err})
// }
// }

exports.reportUser=async(req,res)=>{
    try{
const{reporter_id,report_id,reportreason}=req.body
if(!reporter_id&&!report_id&&!reportreason){
    return res.status(404).json({ message: 'Please provide all the details' });
}
else {
const data=await usermaster.findOne({_id:reporter_id,_id:report_id})
const data1=await usermaster.findOne({_id:report_id})
console.log(data)
      if (!data&&!data1) {
        return res.status(404).json({ message: 'User not found' });
      }
     else if(data&&data1){
        const repor=new report({
            report_id:report_id,
            reporter_id:reporter_id,
            reportreason:reportreason
        })
        const response=await repor.save()
        res.status(200).send({status:true,message:"Reported Successfully",response})
     }else{
        return res.status(404).json({ message: 'User not found' });
     }
    }
}catch(err){
    console.log(err);
    return res.status(400).json({status:'Error',message:'somthing went wrong',err})
}
}


exports.messageHistory = async (req, res) => {
  var sender_id = req.body.sender_id;
  try {
    const result = await chatModule.find(
      { sender_id: { $eq: sender_id } },
      { _id: 0, room_id: 1, other_id: 1, sender_id: 1 }
    );

    const other_id1 = result.map((doc) => doc.other_id);

    const result5 = await chatModule.find(
      { other_id: { $eq: sender_id } },
      { _id: 0, room_id: 1, sender_id: 1 }
    );

    const sender_id1 = result5.map((doc) => doc.sender_id);

    const roomIds3 = result5.map((doc) => doc.room_id);

    const roomIds = result.map((doc) => doc.room_id);

    const result1Promise = chatModule.aggregate([
      {
        $match: {
          other_id: { $in: other_id1 },
          room_id: { $in: roomIds },
        },
      },
      {
        $lookup: {
          from: "usermasters",
          localField: "other_id",
          foreignField: "_id",
          as: "otherdata",
        },
      },
      {
        $lookup: {
          from: "storemsgs",
          localField: "room_id",
          foreignField: "room_id",
          as: "data",
        },
      },
    ]);

    const result2Promise = chatModule.aggregate([
      {
        $match: {
          sender_id: { $in: sender_id1 },
          room_id: { $in: roomIds3 },
        },
      },
      {
        $lookup: {
          from: "usermasters",
          localField: "sender_id",
          foreignField: "_id",
          as: "otherdata",
        },
      },
      {
        $lookup: {
          from: "storemsgs",
          localField: "room_id",
          foreignField: "room_id",
          as: "data",
        },
      },
    ]);

    const [result8, result9] = await Promise.all([
      result1Promise,
      result2Promise,
    ]);

    const combinedResult = [...result8, ...result9];

    const response = combinedResult;

    if (response) {
      res.send({ status: true, message: "Get Data Succesfully", response });
    } else {
      res.status(400).send({ message: "somthing is wrong", err });
    }
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .json({ status: "Error", message: "somthing went wrong", err });
  }
};
