const {chatModule}=require('../models/chatmodule')
const usermaster=require('../models/registration')
const {v4 : uuidv4} = require('uuid')
const connection=require('../models/connection')
const storeMsg=require('../models/storemssage')
const report=require('../models/report')
const {isRoom}=require("../models/chatroom")


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
        
        res.send({status:true,message:"room deleted successfully",result})

    }else{
        res.status(401).send({message:"can not be deleted pls check"})
    }
    
}catch(err)
{
    res.send({message:"somthing is wrong"})
    
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
            
            return res.status(200).send({status:'Success',message:'message deleted successfully',response})
        }else{
            return res.status(406).json({status:'Failure',message:'message couldnot be deleted'})
        }
    }
}catch(err){
    
    return res.status(400).json({status:'Error',message:'somthing went wrong',err})
}
}
exports.reportUser=async(req,res)=>{
    try{
const{reporter_id,report_id,reportreason}=req.body
if(!reporter_id&&!report_id&&!reportreason){
    return res.status(404).json({ message: 'Please provide all the details' });
}
else {
const data=await usermaster.findOne({_id:reporter_id,_id:report_id})
const data1=await usermaster.findOne({_id:report_id})

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
    return res.status(400).json({status:'Error',message:'somthing went wrong',err})
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
      const isuserblocked = isuser.blockContact.includes(other_id)|| false
      const isotheruserblocked = isotherUser.blockContact.includes(sender_id)|| false
        if(isuserblocked||isotheruserblocked){
          res.send({status:false,Message: "Blocked Contact, cannot createChat" })
        }else{
      const isuserprivate=isuser.public
      const isotheruserprivate=isotherUser.public
      const data=await connection.findOne({sender_id:sender_id})
      const isuserconnected=data?.connections?.map(connection => connection._id) || []
      const data1=await connection.findOne({user_id:other_id})
      const isotherconnected=data1?.connections?.map(connection => connection._id) || []
     
      const connectuserStr = isuserconnected.map(id => id.toString());
    
      const connectotherStr = isotherconnected.map(id => id.toString());
    
      
      if (isuser.private===true || isotherUser.private===true) {
        res.send({status:false,Message: "Cannot create chat with private user" })
      }else if (connectuserStr.includes(sender_id)||connectuserStr.includes(other_id)||
      connectotherStr.includes(sender_id)||connectotherStr.includes(other_id)){

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

      var response=await chatModule.find({
            $or:[{sender_id:sender_id,other_id:other_id},{sender_id:other_id,other_id:sender_id}]
      });
      if(response.length!=0){
   
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
  
  let response=[result]
              res.send({status:"Success",message:"room created",response})
         }
         else{
             res.send({ErrorMessage:"some technical issue"})
         }
      }
    }else if(isotheruserprivate===true&&isuserprivate===true) {

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
         
             var response=await chatModule.find({
                   $or:[{sender_id:sender_id,other_id:other_id},{sender_id:other_id,other_id:sender_id}]
             });
             if(response.length!=0){
            
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

      return res.status(400).send({ErrorMessage:"somthing error"})
  }
} 
// exports.messageHistory = async (req, res) => {
//   var sender_id = req.body.sender_id;
//   try {
//     const result = await chatModule.find(
//       { sender_id: { $eq: sender_id } },
//       { _id: 0, room_id: 1, other_id: 1, sender_id: 1 }
//     );

//     const other_id1 = result.map((doc) => doc.other_id);

//     const result5 = await chatModule.find(
//       { other_id: { $eq: sender_id } },
//       { _id: 0, room_id: 1, sender_id: 1 }
//     );

//     const sender_id1 = result5.map((doc) => doc.sender_id);

//     const roomIds3 = result5.map((doc) => doc.room_id);

//     const roomIds = result.map((doc) => doc.room_id);

// // ...

// const result1Promise = chatModule.aggregate([
//   {
//     $match: {
//       other_id: { $in: other_id1 },
//       room_id: { $in: roomIds },
//     },
//   },
//   {
//     $lookup: {
//       from: "usermasters",
//       localField: "other_id",
//       foreignField: "_id",
//       as: "otherdata",
//     },
//   },
//   {
//     $lookup: {
//       from: "storemsgs",
//       localField: "room_id",
//       foreignField: "room_id",
//       as: "data",
//     },
//   },
//   {
//     $unwind: "$data" // Unwind the "data" array field
//   },
//   {
//     $sort: { "data.createdAt": -1 } // Sort based on "createdAt" field in descending order
//   },
//   {
//     $group: {
//       _id: "$_id",
//       // ... Include other fields you want to keep
//       room_id: { $first: "$room_id" },
//       other_id: { $first: "$other_id" },
//       sender_id: { $first: "$sender_id" },
//       otherdata: { $first: "$otherdata" },
//       data: { $push: "$data" } // Push sorted "data" array back
//     }
//   },
// ]);

// const result2Promise = chatModule.aggregate([
//   {
//     $match: {
//       sender_id: { $in: sender_id1 },
//       room_id: { $in: roomIds3 },
//     },
//   },
//   {
//     $lookup: {
//       from: "usermasters",
//       localField: "sender_id",
//       foreignField: "_id",
//       as: "otherdata",
//     },
//   },
//   {
//     $lookup: {
//       from: "storemsgs",
//       localField: "room_id",
//       foreignField: "room_id",
//       as: "data",
//     },
//   },
//   {
//     $unwind: "$data" // Unwind the "data" array field
//   },
//   {
//     $sort: { "data.createdAt": -1 } // Sort based on "createdAt" field in descending order
//   },
//   {
//     $group: {
//       _id: "$_id",
//       // ... Include other fields you want to keep
//       room_id: { $first: "$room_id" },
//       sender_id: { $first: "$sender_id" },
//       otherdata: { $first: "$otherdata" },
//       data: { $push: "$data" } // Push sorted "data" array back
//     }
//   },
// ]);

// // ...

    

//     const [result8, result9] = await Promise.all([
//       result1Promise,
//       result2Promise,
//     ]);

//     const combinedResult = [...result8, ...result9];

//     const response = combinedResult;

//     if (response) {
//       res.send({ status: true, message: "Get Data Succesfully", response });
//     } else {
//       res.status(400).send({ message: "somthing is wrong", err });
//     }
//   } catch (err) {
   
//     return res
//       .status(400)
//       .json({ status: "Error", message: "somthing went wrong", err });
//   }
// };

// exports.messageHistory = async (req, res) => {
//   var sender_id = req.body.sender_id;
//   try {
//     const result = await chatModule.find(
//       { sender_id: { $eq: sender_id } },
//       { _id: 0, room_id: 1, other_id: 1, sender_id: 1 }
//     );

//     const other_id1 = result.map((doc) => doc.other_id);

//     const result5 = await chatModule.find(
//       { other_id: { $eq: sender_id } },
//       { _id: 0, room_id: 1, sender_id: 1 }
//     );

//     const sender_id1 = result5.map((doc) => doc.sender_id);

//     const roomIds3 = result5.map((doc) => doc.room_id);

//     const roomIds = result.map((doc) => doc.room_id);

//     const result1Promise = chatModule.aggregate([
//       {
//         $match: {
//           other_id: { $in: other_id1 },
//           room_id: { $in: roomIds },
//         },
//       },
//       {
//         $lookup: {
//           from: "storemsgs",
//           localField: "room_id",
//           foreignField: "room_id",
//           as: "data",
//         },
//       },
//       {
//         $lookup: {
//           from: "usermasters",
//           localField: "other_id",
//           foreignField: "_id",
//           as: "otherdata",
//         },
//       },
//     ]);

//     const result2Promise = chatModule.aggregate([
//       {
//         $match: {
//           sender_id: { $in: sender_id1 },
//           room_id: { $in: roomIds3 },
//         },
//       },
//       {
//         $lookup: {
//           from: "storemsgs",
//           localField: "room_id",
//           foreignField: "room_id",
//           as: "data",
//         },
//       },
//       {
//         $lookup: {
//           from: "usermasters",
//           localField: "other_id",
//           foreignField: "_id",
//           as: "otherdata",
//         },
//       },
//     ]);

//     const [result8, result9] = await Promise.all([
//       result1Promise,
//       result2Promise,
//     ]);

//     const combinedResult = [...result8, ...result9];

//     // Sort the combinedResult based on the createdAt property of the most recent message in the data array
//     combinedResult.sort((a, b) => {
//       const aRecentMessage = a.data.length > 0 ? a.data[a.data.length - 1].createdAt : 0;
//       const bRecentMessage = b.data.length > 0 ? b.data[b.data.length - 1].createdAt : 0;
//       return bRecentMessage - aRecentMessage;
//     });

//     const response = combinedResult;

//     if (response) {
//       res.send({ status: true, message: "Get Data Successfully", response });
//     } else {
//       res.status(400).send({ message: "Something is wrong", err });
//     }
//   } catch (err) {
//     return res
//       .status(400)
//       .json({ status: "Error", message: "Something went wrong", err });
//   }
// };
   
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
          from: "storemsgs",
          localField: "room_id",
          foreignField: "room_id",
          as: "data",
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
          from: "storemsgs",
          localField: "room_id",
          foreignField: "room_id",
          as: "data",
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
    ]);

    const [result8, result9] = await Promise.all([
      result1Promise,
      result2Promise,
    ]);

    const combinedResult = [...result8, ...result9];

    combinedResult.sort((a, b) => {
      const aRecentMessage = a.data.length > 0 ? a.data[a.data.length - 1].createdAt : 0;
      const bRecentMessage = b.data.length > 0 ? b.data[b.data.length - 1].createdAt : 0;
      return bRecentMessage - aRecentMessage;
    });

    const filteredResult = combinedResult.filter(item => item.data.length > 0);

    if (filteredResult.length > 0) {
      res.send({ status: true, message: "Get Data Successfully", response: filteredResult });
    } else {
      res.status(400).send({ message: "No data found" });
    }
  } catch (err) {
    return res
      .status(400)
      .json({ status: "Error", message: "Something went wrong", err });
  }
};
exports.isChatRoom=async(req, res)=>{
  try{
const {sender_id,room_id}=req.body
if(!sender_id&&!room_id){
  res.status(400).send({status:false,message:"Please provide all the detais"})
}else{
  const data=await isRoom.findOne({sender_id:sender_id,room_id:room_id})
  if(data){
    await isRoom.findOneAndUpdate({sender_id:sender_id,room_id:room_id},{isChatroom:true})
    const response=await isRoom.findOne({sender_id:sender_id,room_id:room_id})
    res.status(200).send({status:true,message:" is chatroom",response})
  }else{
    const datas=new isRoom({
      sender_id:sender_id,
      room_id:room_id,
      isChatroom:true
    })
    const response=await datas.save()
    res.status(400).send({status:true,message:" is chatroom",response})
  }
}
}catch (err) {
  
    return res.status(400).json({ status: "Error", message: "Something went wrong", err });
  }
}

exports.isNotChatRoom=async(req, res)=>{
  try{
const {sender_id,room_id}=req.body
if(!sender_id&&!room_id){
  res.status(400).send({status:false,message:"Please provide all the detais"})
}else{
  const data=await isRoom.findOne({sender_id:sender_id,room_id:room_id})
  
  if(data){
    await isRoom.findOneAndUpdate({sender_id:sender_id,room_id:room_id},{isChatroom:false})
    const response=await isRoom.findOne({sender_id:sender_id,room_id:room_id})
    res.status(200).send({status:true,message:" is chatroom",response})
  }else{
    const datas=new isRoom({
      sender_id:sender_id,
      room_id:room_id,
      isChatroom:false
    })
    const response=await datas.save()
    res.status(400).send({status:true,message:" is chatroom",response})
  }
}
}catch (err) {
  
    return res.status(400).json({ status: "Error", message: "Something went wrong", err });
  }
}

