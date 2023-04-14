const usermaster=require("../models/registration");
const Astro=require('../models/astrosign')
const Hobbies = require("../models/hobbies");
const post=require('../models/posts')
const connection=require('../models/connection')

exports.createProfile=async(req,res)=>{
    try{
       const _id=req.body._id
       const name=req.body.name
       const bio=req.body.bio
       const dob=req.body.dob
       const occupation=req.body.occupation
       const location=req.body.location
       const gender=req.body.gender
       const addprounous=req.body.addprounous
       const AstroSign=req.body.AstroSign
      const Hobbies=req.body.Hobbies
      const profile_img=req.file.filename 
         
            const result = await usermaster.findOneAndUpdate({_id:_id},{$set:{profile_img:profile_img,profile:true,name:name,bio:bio,dob:dob,
               occupation:occupation,location:location,gender:gender,addprounous:addprounous,AstroSign:AstroSign,Hobbies:Hobbies}},{new:true})
            if(result){

         const result = await usermaster.findOne({_id:_id})
            return res.status(200).json({Status:true,message:'profile ctreated successfully',result})
         }else{
            return res.status(406).send({Status:false,message:'not found anything'})
         }
        }
     
      catch(err){
         console.log('err',err.message);
         return res.status(400).json({Status:'Error',Error})
      }
 }
// exports.createProfileImage=async(req,res)=>{
//    try{
//       const{_id}=req.body
//    const profile_img=req.file.filename
//    const result = await usermaster.findOneAndUpdate({_id:_id},{$set:{profile_img:profile_img}})
//    if(result){
//       const result = await usermaster.findOne({_id:_id})
//          return res.status(200).json({Status:true,message:'profile ctreated successfully',result})
//       }else{
//          return res.status(406).send({Status:false,message:'not found anything'})
//       }
//      }catch(err){
//       console.log('err',err.message);
//       return res.status(400).json({Status:'Error',Error})
//    }
// }

exports.updateProfile=async(req,res)=>{
    try{
        const {_id}=req.body
        const name=req.body.name
        const bio=req.body.bio
        const dob=req.body.dob
        const occupation=req.body.occupation
        const location=req.body.location
        const gender=req.body.gender
        const addpronous=req.body.addpronous
        const AstroSign=req.body.AstroSign
        const Hobbies=req.body.Hobbies
        const profile_img=req.file.filename
                  
          
             const result = await usermaster.findOneAndUpdate({_id:_id},{$set:{profile_img:profile_img,Hobbies:Hobbies,AstroSign:AstroSign,name:name,bio:bio,dob:dob,occupation:occupation,location:location,gender:gender,addpronous:addpronous,profile:true}},{new:true})
       if(result){
         const result = await usermaster.findOne({_id:_id})
             return res.status(200).json({Status:true,message:'profile ctreated successfully',result})
          }
         }
     
      catch(err){
         console.log('err',err.message);
         return res.status(400).json({Status:'Error',Error})
      }
 }
//  exports.updateprofileImage=async(req,res)=>{
//    try{
//       const{_id}=req.body
//    const profile_img=req.file.filename
//    const result = await usermaster.findOneAndUpdate({_id:_id},{$set:{profile_img:profile_img}})
//    if(result){
//       const result = await usermaster.findOneAndUpdate({_id:_id})
//          return res.status(200).json({Status:true,message:'profile ctreated successfully',result})
//       }
//      }catch(err){
//       console.log('err',err.message);
//       return res.status(400).json({Status:'Error',Error})
//    }
// } 

exports.getProfile=async(req,res)=>{
    try{
        const{_id}=req.params
        const result = await usermaster.findOne({_id:_id})
        const Astro=result.AstroSign
        const Hobbies=result.Hobbies
        const respons = await usermaster.find({AstroSign:Astro, _id: { $ne: _id } })
       
        const respond = await usermaster.find({Hobbies: Hobbies, _id: { $ne: _id }  } )
        const results=await post.find({user_id:{$eq:_id}},{_id:0,Post_img:1})
        const count=await connection.findOne({user_id:_id},{_id:0,connections:1})
       // const  connect=count.connections
        const Connection= count ? count.connections.length : 0;
        console.log(Connection);
       console.log(results)
   const userIds = new Set();

   respons.forEach(user => {
     userIds.add(user._id.toString());
   });
   respond.forEach(user => {
     userIds.add(user._id.toString());
   });
   const matchesProfileCount = userIds.size;
   
   console.log(matchesProfileCount);
      const posts=results.length
      console.log(posts);
      
     
   
                 return res.status(200).json({Status:true,message:'profile fetched successfully',result,matchesProfileCount,Connection,posts})
   }catch(err){
         console.log('err',err.message);
         return res.status(400).json({Status:'Error',Error})
      }

}

exports.addAstroSign=async(req,res)=>{
   try{
      
       const {AstroSign_name}=req.body
       if(!AstroSign_name&&!req.file){ 
          return res.status(406).send({Status:false,message:'please provide all details'})
       }
      else if(req.file){
         const data=new Astro({
            AstroSign_img:req.file.filename,
            AstroSign_name:AstroSign_name
         })
         const response= await data.save()
         if(response){
            return res.status(200).json({Status:true,message:'astro ctreated successfully',response})
         }
      }
   }catch(err){
        console.log('err',err.message);
        return res.status(400).json({Status:'Error',Error})
     }

}
exports.addHobbies=async(req,res)=>{
   try{

       const {Hobbies_name}=req.body
       if(!Hobbies_name&&!req.file){ 
         return res.status(406).send({Status:false,message:'please provide all details'})
      }
     else if(req.file){
         const data=new Hobbies({
            Hobbies_img:req.file.filename,
            Hobbies_name:Hobbies_name
         })
         const response= await data.save()
         if(response){
            return res.status(200).json({Status:true,message:'astro ctreated successfully',response})
         }else{
            return res.status(406).send({Status:false,message:'not found anything'})
         }
      }
   }catch(err){
        console.log('err',err.message);
        return res.status(400).json({Status:'Error',Error})
     }

}

exports.getAstroSign=async(req,res)=>{
   try{
   const response= await Astro.find()
   if(response){
      return res.status(200).json({Status:true,message:'astro fetched successfully',response})
   }else{
      return res.status(406).send({Status:false,message:'not found anything'})
   }

}catch(err){
   console.log('err',err.message);
   return res.status(400).json({Status:'Error',Error})
}

}
exports.getHobbies=async(req,res)=>{
   try{
   const response= await Hobbies.find()
   if(response){
      return res.status(200).json({Status:true,message:'Hobbies fetched successfully',response})
   }else{
      return res.status(406).send({Status:false,message:'not found anything'})
   }

}catch(err){
   console.log('err',err.message);
   return res.status(400).json({Status:'Error',Error})
}
}

exports.getAllProfile=async(req,res)=>{
   try{
       const result = await usermaster.find({},{_id:1,profile_img:1,name:1,email:1,mobilenumber:1})
                return res.status(200).json({Status:true,message:'profile fetched successfully',result})
   }catch(err){
        console.log('err',err.message);
        return res.status(400).json({Status:'Error',Error})
     }

}


exports.getOtherprofile=async(req,res)=>{
   try{
      const {_id}=req.body

     if(_id){ 
const result=await usermaster.findOne({_id:_id},{_id:0,profile_img:1,name:1,bio:1,AstroSign:1,Hobbies:1})
const Astro=result.AstroSign
const Hobbies=result.Hobbies
const respons = await usermaster.find({AstroSign:Astro, _id: { $ne: _id }})

const respond = await usermaster.find({Hobbies: Hobbies, _id: { $ne: _id } } )
const postimages=await post.find({user_id:{$eq:_id}},{_id:0,Post_img:1})
console.log(postimages)
const userIds = new Set();

respons.forEach(user => {
  userIds.add(user._id.toString());
});
respond.forEach(user => {
  userIds.add(user._id.toString());
});
const matchesProfileCount = userIds.size;
console.log(matchesProfileCount);
const posts=postimages.length
const count=await connection.findOne({user_id:_id},{_id:0,connections:1})
   //    const  connect=count.connections
   // const connections=connect.length
   // console.log(connections);
   const connections=count ? count.connections.length : 0;
                                   console.log(connections);

if(result){
   return res.status(200).json({Status:true,message:'profile fetched successfully',result,matchesProfileCount,connections,posts,postimages})
}
     }else{
      return res.status(400).json({Status:false,message:'provide id '})
     }
   }catch(err){
        console.log('err',err.message);
        return res.status(400).json({Status:'Error',Error})
     }
}