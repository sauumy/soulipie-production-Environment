const Users = require('../models/registration');

exports.blockContact = async(req,res)=>{
    try{
        const {user_id,other_number} = req.body
        const result1=await Users.findOne({_id:user_id},{_id:0,blockContact:1})
        console.log(result1)
        const result2=result1.blockContact || []
        console.log(result2)
        if(!user_id || !other_number){
            return res.status(406).json({status:'Failure',message:'user_id and other_number are required field'})
        }else if(!result2.includes(other_number)) {

            const response = await Users.findOneAndUpdate({_id:user_id},{$push:{blockContact:other_number}})
            if(response){
                const respons=await Users.findOne({_id:user_id})
            return res.status(200).send({status:'Success',message:'',respons})
            }
         
        }else{
            return res.status(406).json({status:'Failure',message:'already in blocked contact'})
        }

    }catch(err){
        console.log(err);
        return res.status(400).json({status:'Error',message:'somthing went wrong',err})
    }
}
exports.unBlockContact=async(req,res)=>{
    try{
        const {user_id,other_number} = req.body
        const result1=await Users.findOne({_id:user_id},{_id:0,blockContact:1})
        console.log(result1)
        const result2=result1.blockContact
        console.log(result2)
        if(!user_id || !other_number){
            return res.status(406).json({status:'Failure',message:'user_id and other_number are required field'})
        }else if(result2.includes(other_number)) {

            const respons = await Users.findOneAndUpdate({_id:user_id},{$pull:{blockContact:other_number}})
            if(respons){
                const response=await Users.findOne({_id:user_id})
            return res.status(200).send({status:'Success',message:'',response})
            }
         
        }else{
            return res.status(406).json({status:'Failure',message:'already in blocked contact'})
        }

    }catch(err){
        console.log(err);
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
            console.log(response)
            if(response){
            return res.status(200).send({status:'Success',message:'data fetched blockcontact',response})
            }
         
        }

    }catch(err){
        console.log(err);
        return res.status(400).json({status:'Error',message:'somthing went wrong',err})
    }
}