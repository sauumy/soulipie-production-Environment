const Users = require('../models/registration');
const connections=require('../models/connection')
const request=require('../models/requests')
const notification=require('../models/notification')
const chaservice=require('../services/chapter-service')
const service=require('../services/mobile_service')
const otpService = require('../services/otp_service')
const jwtTokenService = require('../services/jwt-service')
const {chatModule}=require('../models/chatmodule')
const onlineoffline=require('../models/onlineoffline')
const {Experience}=require('../models/userExperience')
exports.blockContact = async(req,res)=>{
    try{
        const {user_id,other_number} = req.body
        const result1=await Users.findOne({_id:user_id},{_id:0,blockContact:1})
      
        const result2=result1.blockContact || []
       
        if(!user_id || !other_number){
            return res.status(406).json({status:'Failure',message:'user_id and other_number are required field'})
        }else if(!result2.includes(other_number)) {

            const response = await Users.findOneAndUpdate({_id:user_id},{$push:{blockContact:other_number}})
            const data=await Users.findOne({_id:other_number},{_id:1,profile_img:1,name:1,token:1})
            await connections.updateOne({user_id:user_id},{$pull:{connections:data}})
            await connections.updateOne({user_id:user_id},{$pull:{totalrequest:data}})
            await notification.findOneAndDelete({})
            const filter = {
                $or: [
                    {
                      fromUser: other_number,
                      toUser: user_id
                    },
                    {
                      fromUser: user_id,
                      toUser: other_number
                    }
                  ]
              };
              await request.findOneAndDelete(filter);
              const filters = {
                $or: [
                    {
                      sender_id: other_number,
                      other_id: user_id
                    },
                    {
                      sender_id: user_id,
                      other_id: other_number
                    }
                  ]
              };
              const update = {
                blocked: true // Set blocked to the desired value
              };
              await chatModule.findOneAndUpdate(filters,update)
            if(response){
                const data=await chatModule.findOne({})
                const respons=await Users.findOne({_id:user_id})
            return res.status(200).send({status:'Success',message:'',respons})
            }
         
        }else{
            return res.status(406).json({status:'Failure',message:'already in blocked contact'})
        }

    }catch(err){
        
        return res.status(400).json({status:'Error',message:'somthing went wrong',err})
    }
}
exports.unBlockContact=async(req,res)=>{
    try{
        const {user_id,other_number} = req.body
        const result1=await Users.findOne({_id:user_id},{_id:0,blockContact:1})
        
        const result2=result1.blockContact
      
        if(!user_id || !other_number){
            return res.status(406).json({status:'Failure',message:'user_id and other_number are required field'})
        }else if(result2.includes(other_number)) {

            const respons = await Users.findOneAndUpdate({_id:user_id},{$pull:{blockContact:other_number}})
            if(respons){
                const filters = {
                    $or: [
                        {
                          sender_id: other_number,
                          other_id: user_id
                        },
                        {
                          sender_id: user_id,
                          other_id: other_number
                        }
                      ]
                  };
                  const update = {
                    blocked: false 
                  };
                  await chatModule.findOneAndUpdate(filters,update)
                const response=await Users.findOne({_id:user_id})
            return res.status(200).send({status:'Success',message:'',response})
            }
         
        }else{
            return res.status(406).json({status:'Failure',message:'already in blocked contact'})
        }

    }catch(err){
       
        return res.status(400).json({status:'Error',message:'somthing went wrong',err})
    }
}
exports.getBlockContact=async(req,res)=>{
    try{
        const {user_id} = req.body
        if(!user_id){
            return res.status(406).json({status:'Failure',message:'user_id and are required field'})
        }else  {
            const response=await Users.findOne({_id:user_id},{_id:0,blockContact:1})
            const ids=response.blockContact
            const result=await Users.find({_id:{$in:ids}},{_id:1,name:1,profile_img:1})
            
            if(response&&result){
            return res.status(200).send({status:'Success',message:'data fetched blockcontact',response,result})
            }
        }
    }catch(err){
       
        return res.status(400).json({status:'Error',message:'somthing went wrong',err})
    }
}

exports.chaneNumber = async (req, res) => {
    try {
        
      if (!req.body.mobilenumber||!req.body._id) {
        return res.status(406).send({ Status: false, message: 'Mobilenumber&name is required field' });
      } else {
        const data=await Users.findOne({mobilenumber:req.body.mobilenumber})
        if(data){
            return res.status(406).send({ Status: false, message: 'This Number Is already Exists' });
        }else{
        let account;
        account = await Users.findOne({_id:req.body._id});
        if (!account) {
          return res.status(406).send({ Status: false, message: 'You donot have any account' });
        } else {
            return res.status(406).send({ Status: true, message: 'otp sent Successfully on the number' });
      }
    }
}
}catch(err){
       return res.status(400).send({Status:'Error',message:'somthing went wrong'})
      }  
    }
    exports.changeNumberverify = async (req, res) => {
        try{
            const {mobilenumber,_id} = req.body
            if(!mobilenumber){
                return res.status(406).send({Status:false,message:'mobilenumber,hashdata and otp required fields'})
            } 
            else{
                const result=await Users.findOneAndUpdate({_id:_id},{$set:{mobilenumber:mobilenumber}},{new:true})  
                if(result){
                    const response=await Users.findOne({_id:_id})
                    return res.status(406).send({Status:true,message:'Otp Verified successfully',response})
                }else{
                    return res.status(406).send({Status:false,message:'Error W hile updating mobilenumber'})
                }
            }
        
        }catch(err){
            
            return res.status(400).send({Status:'Error',message:'somthing went wrong'})
                   }
        }
exports.securitySetting=async(req,res)=>{
    try{
        const {_id,private,public,connected}=req.body
        if(!_id){
            return res.status(406).json({status:'Failure',message:'user_id and are required field'})
        }else{
if(_id&&private){
  await Users.findOneAndUpdate({_id:_id},{$set:{private:private,public:false,connected:false}})
  const response=await Users.findOne({_id:_id})
    return res.status(200).json({status:true,message:'Your Account is now private',response})
}else if(_id&&connected){
    await Users.findOneAndUpdate({_id:_id},{$set:{connected:connected,public:false,private:false}})
    const response=await Users.findOne({_id:_id})
    return res.status(200).json({status:true,message:'Your Account is now visible to connections only',response})
}else{
    await Users.findOneAndUpdate({_id:_id},{$set:{public:public,private:false,connected:false}})
    const response=await Users.findOne({_id:_id})
    return res.status(200).json({status:true,message:'Your Account is now public',response})
}
        }

    }catch(err){
        
            return res.status(400).send({Status:'Error',message:'somthing went wrong'})
                   }
}

exports.userlogin=async(req,res)=>{
    try{

const {userId,time}=req.body
const data=await onlineoffline.findOne({userId:userId})
console.log(data)
if(data){
    const update=await onlineoffline.findOneAndUpdate({userId:userId},{$set:{online:true,Offline:false,time:time}})
    if(update){
    const response=await onlineoffline.findOne({userId:userId})
    return res.status(200).send({status:true,message:'user is Online',response})
    }else{
        return res.status(200).send({status:false,message:'something error'})
    }
}else{
    const data=new onlineoffline({
        userId:userId,
        online:true,
        Offline:false,
        time:time
    })
    const response=await data.save()
    return res.status(200).send({status:true,message:'user is Online',response})
}

    }catch(err){
        
            return res.status(400).send({Status:'Error',message:'somthing went wrong'})
                   }
}

exports.userOffline=async(req,res)=>{
    try{

const {userId,time}=req.body
const data=await onlineoffline.findOne({userId:userId})
console.log(data)
if(data){
    const update=await onlineoffline.findOneAndUpdate({userId:userId},{$set:{Offline:true,online:false,time:time}})
    if(update){
    const response=await onlineoffline.findOne({userId:userId})
    return res.status(200).send({status:true,message:'user is Online',response})
    }else{
        return res.status(200).send({status:false,message:'something error'})
    }
}else{
    const data=new onlineoffline({
        userId:userId,
        Offline:true,
        online:false,
        time:time
    })
    const response=await data.save()
    return res.status(200).send({status:true,message:'user is Online',response})
}

    }catch(err){
        
            return res.status(400).send({Status:'Error',message:'somthing went wrong'})
                   }
}

exports.getuseronlineorofline=async(req,res)=>{
    try{
const {userId}=req.body
const response=await onlineoffline.find({userId:userId})
return res.status(200).send({status:true,message:'get successfully',response})
    }catch(err){
            return res.status(400).send({Status:'Error',message:'somthing went wrong'})
                   }
}

exports.userExperience = async (req, res) => {
    try {
      const { user_id, text, rating, recommendation, private, public } = req.body;
  
      const data = new Experience({
        user_id: user_id || null,
        text: text || null,
        rating: rating || null,
        recommendation: recommendation || null,
        private: private || null,
        public: public || null
      });
  
      const response = await data.save();
      if (response) {
        return res
          .status(200)
          .json({ status: true, message: "Thank you for valuable feedback", response });
      }
    } catch (err) {
      console.log(err);
      return res.status(400).send({ status: 'Error', message: 'Something went wrong' });
    }
  };
  
exports.getUserExperience=async(req,res)=>{
    try{
const{user_id}=req.body
if(!user_id){
    return res.status(200).json({ status:false, message: "Provide all the details" });
}else{
    const response=await Experience.findOne({user_id:user_id})
    if(response){
    return res.status(200).json({ status: true, message: "Data fetched successfully", response });
}else{
    return res.status(200).json({ status:false, message: "something went wrong" });
} 
}
}catch (err) {
      console.log(err);
      return res.status(400).send({ status: 'Error', message: 'Something went wrong' });
    }
}