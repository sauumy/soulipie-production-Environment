const usermaster=require("../models/registration");
const Astro=require('../models/astrosign')
const Hobbies = require("../models/hobbies");
const post=require('../models/posts')
const connection=require('../models/connection')
const bookmarks=require('../models/bookmarks')
const exploreModel=require('../models/explore')
const request=require('../models/requests')
const notification=require('../models/notification')
const likepost=require('../models/likespost')
const comments=require('../models/comments')
const replycomment=require('../models/replycomment')
const mongoose=require('mongoose');

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
       const result = await usermaster.find()
                return res.status(200).json({Status:true,message:'profile fetched successfully',result})
   }catch(err){
        console.log('err',err.message);
        return res.status(400).json({Status:'Error',Error})
     }

}

// exports.getOtherprofile=async(req,res)=>{
//    try{
//       const {_id}=req.body

//      if(_id){ 
// const result=await usermaster.findOne({_id:_id},{_id:0,profile_img:1,name:1,bio:1,AstroSign:1,Hobbies:1})
// const Astro=result.AstroSign
// const Hobbies=result.Hobbies
// const respons = await usermaster.find({AstroSign:Astro, _id: { $ne: _id }})

// const respond = await usermaster.find({Hobbies: Hobbies, _id: { $ne: _id } } )
// const postimages=await post.find({user_id:{$eq:_id}},{_id:0,Post_img:1})
// console.log(postimages)
// const userIds = new Set();

// respons.forEach(user => {
//   userIds.add(user._id.toString());
// });
// respond.forEach(user => {
//   userIds.add(user._id.toString());
// });
// const matchesProfileCount = userIds.size;
// console.log(matchesProfileCount);
// const posts=postimages.length
// const count=await connection.findOne({user_id:_id},{_id:0,connections:1})
//    const connections=count ? count.connections.length : 0;
//                                    console.log(connections);

// if(result){
//    return res.status(200).json({Status:true,message:'profile fetched successfully',result,matchesProfileCount,connections,posts,postimages})
// }
//      }else{
//       return res.status(400).json({Status:false,message:'provide id '})
//      }
//    }catch(err){
//         console.log('err',err.message);
//         return res.status(400).json({Status:'Error',Error})
//      }
// }
// exports.savePost=async(req,res)=>{
//    try{
//       const {post_id,user_id}=req.body
//       if(!post_id&&!user_id){
//          return res.status(400).json({Status:false,message:'please provide all the details'})
//       }
//       else if(post_id&&user_id){
//          const user=await bookmarks.findOne({user_id:user_id})
//          console.log(user)
//          if (!user){
//             const data=new bookmarks({
//                user_id:user_id,
//                saved:post_id
//             })
//             const responses=await data.save()
//             return res.status(200).json({Status:true,message:'Saved post successfully',responses})
//          }
//          else if (user) {
//             const saved =user.saved
//             console.log(saved)
//             for (let i = 0; i < saved.length; i++) {
//                if (saved[i] == post_id) {
//                   const response=await bookmarks.updateOne({user_id:user_id},{$pull:{saved:post_id}})
//                   return res.status(200).json({Status:false,message:'unsuccessfully',response})
//                }
               
//              }
//              return res.status(200).json({Status:false,message:'successfully'})
//          }
           
//       }
     
//    }
// catch(err){
//         console.log('err',err.message);
//         return res.status(400).json({Status:'Error',Error})
//      }
// }
exports.savePost = async (req, res) => {
   try {
     const { post_id, user_id } = req.body;
     if (!post_id || !user_id) {
       return res.status(400).json({ Status: false, message: 'Please provide all the details' });
     } else {
      const datas=await post.findOne({_id:post_id},{_id:1,user_id:1,Post_img:1})
      if(datas){
       const user = await bookmarks.findOne({ user_id: user_id ,saved:datas});
       console.log(user);
     
       if (!user) {
         const data = new bookmarks({
           user_id: user_id,
           saved: datas 
         });
         const response = await data.save();
         return res.status(200).json({ Status: true, message: 'Saved post successfully', response });
       } 
       else if (user) {
         const response=await bookmarks.findOneAndDelete({user_id:user_id,saved:datas})
         if(response){
             return res.status(200).json({ Status: true, message: 'Unsaved post successfully',response });
           
         }else{
            return res.status(400).json({ Status: false, message: 'something error while unsaving' });
         }
         
       }else{
         return res.status(400).json({ Status: false, message: 'user doesnot found' });
       }
       }else{
         return res.status(400).json({ Status: false, message: 'no post' });
       }
      }  
}catch (err) {
   console.log('err', err.message);
   return res.status(400).json({ Status: 'Error', message: err.message });
 }
}
exports.getSavedPost=async(req,res)=>{
try{
   const {_id}=req.params
   const response=await bookmarks.find({user_id:_id},{_id:0,saved:1})
   console.log(response)
   const result=response.saved
   if(result){
      return res.status(200).json({Status:true,message:'Saved fetch successfully',result})
   }else{
      return res.status(400).json({Status:false,message:'Error while fetching the saved'})
   }
}catch(err){
   console.log('err',err.message);
   return res.status(400).json({Status:'Error',Error})
}
}


// exports.explore=async(req,res)=>{
//    try{
//       const {_id}=req.body
//       const result=await usermaster.findOne({_id:_id},{_id:0,profile_img:1,name:1,bio:1,AstroSign:1,Hobbies:1})
//       const Astro=result.AstroSign
//       const Hobbies=result.Hobbies
//       const respons = await usermaster.find({AstroSign:Astro, _id: { $ne: _id }},{_id:1,profile_img:1,occupation:1,name:1})
//       const astros = respons.map(doc => doc._id);
      
//       const respond = await usermaster.find({Hobbies: Hobbies, _id: { $ne: _id } },{_id:1,profile_img:1,occupation:1,name:1} )
//       const hobbies = respond.map(doc => doc._id)
//       const result1Promise=await usermaster.aggregate([
//          {
//             $match: {
//               _id: { $in: astros }
//             }
//           },
//           {
//             $lookup: {
//               from: "posts",
//               localField: "_id",
//               foreignField: "user_id",
//               as: "explore"
//             }
//           },
//           {
//             $project: {
//               _id: 1,
//               name:1,
//               occupation:1,
//               profile_img:1,
//               'explore.Post_img': 1,
//               'explore.Post_discription':1,
//               'explore._id':1,
//             },
//           },
//       ])
//       console.log (result1Promise)
//       const result2Promise=await usermaster.aggregate([
//          {
//             $match: {
//               _id: { $in: hobbies }
//             }
//           },
//           {
//             $lookup: {
//               from: "posts",
//               localField: "_id",
//               foreignField: "user_id",
//               as: "explore"
//             }
//           },
//           {
//             $project: {
//               _id: 1,
//               name:1,
//               occupation:1,
//               profile_img:1,
//               'explore.Post_img': 1,
//               'explore.Post_discription':1,
//               'explore._id':1,
//             },
//           },
//       ])
//       console.log (result2Promise)
//       const [result8, result9] = await Promise.all([result1Promise, result2Promise]);
  
//       const combinedResult = [...result8, ...result9];
//       console.log(combinedResult);
  
//       const response = Array.from(new Set(combinedResult.map(JSON.stringify))).map(JSON.parse);
//       if(response){
//          return res.status(200).json({Status:true,message:'explore fetched successfully',response})
//       }
     
//    }catch(err){
//      console.log('err',err.message);
//      return res.status(400).json({Status:'Error',Error})
//    }
//  }


// exports.explore = async (req, res) => {
//    try {
//       const {_id} = req.body;
//       const result = await usermaster.findOne({_id: _id}, {_id: 0, profile_img: 1, name: 1, bio: 1, AstroSign: 1, Hobbies: 1});
//       const Astro = result.AstroSign;
//       const Hobbies = result.Hobbies;
//       const astroUsers = await usermaster.find({AstroSign: Astro, _id: {$ne: _id}}, {_id: 1, profile_img: 1, occupation: 1, name: 1});
//       const astroIds = astroUsers.map(doc => doc._id);

//       const hobbiesUsers = await usermaster.find({Hobbies: Hobbies, _id: {$ne: _id}}, {_id: 1, profile_img: 1, occupation: 1, name: 1});
//       const hobbiesIds = hobbiesUsers.map(doc => doc._id);

//       const result1Promise = await usermaster.aggregate([
//          {
//             $match: {
//               _id: {$in: astroIds}
//             }
//           },
//           {
//             $lookup: {
//               from: "posts",
//               localField: "_id",
//               foreignField: "user_id",
//               as: "explore"
//             }
//           },
//           {
//             $project: {
//               _id: 1,
//               name: 1,
//               occupation: 1,
//               profile_img: 1,
//               'explore.Post_img': 1,
//               'explore.Post_discription': 1,
//               'explore._id': 1,
//             },
//           },
//       ]);

//       const result2Promise = await usermaster.aggregate([
//          {
//             $match: {
//               _id: {$in: hobbiesIds}
//             }
//           },
//           {
//             $lookup: {
//               from: "posts",
//               localField: "_id",
//               foreignField: "user_id",
//               as: "explore"
//             }
//           },
//           {
//             $project: {
//               _id: 1,
//               name: 1,
//               occupation: 1,
//               profile_img: 1,
//               'explore.Post_img': 1,
//               'explore.Post_discription': 1,
//               'explore._id': 1,
//             },
//           },
//       ]);

//       const [result1, result2] = await Promise.all([result1Promise, result2Promise]);

//       const combinedResult = [...result1, ...result2];

//       const response = Array.from(new Set(combinedResult.map(JSON.stringify))).map(JSON.parse);

//       // Loop through each object in the response and create a new document in the "explore" collection if it doesn't already exist
//       for (const item of response) {
//          const existingExplore = await exploreModel.findOne({user_id:_id,'matchedprofiles._id':item._id});

//          if (!existingExplore) {
//             const newExplore = new exploreModel({
//                user_id:_id,
//                matchedprofiles: item,
//             });

//             const savedExplore = await newExplore.save();

//             if (!savedExplore) {
//                return res.status(400).json({Status: 'Error', message: 'Unable to save explore'});
//             }
//          }
      

//       const results = await exploreModel.find({user_id:_id});
//       if(results){
//          const filter = {
//             $or: [
//                 {
//                   fromUser: _id,
//                   toUser: item._id
//                 },
//                 {
//                   fromUser: item._id,
//                   toUser: _id
//                 }
//               ]
//           };
//           const data=await request.findOne(filter);
//           if(data){
//       const check=data.requestPending
//       console.log(check)
//       if(check==true){
//        await exploreModel.findOneAndUpdate({user_id:_id,'matchedprofiles._id':item._id},{$set:{requested:true,connected:false}})

//       }else{
//          await exploreModel.findOneAndUpdate({user_id:_id,'matchedprofiles._id':item._id},{$set:{connected:true,requested:false}})
//       }
//       const explore=await exploreModel.find({user_id:_id})
//       return res.status(200).json({Status: true, message: 'explore fetched successfully', explore});

//    }else{
//       return res.status(400).json({Status:false,message:"couldnot find any data"})
//    }
// }else{
//    return res.status(400).json({Status:false,message:"couldnot find any request"})
// }
//    } 
// } 
// catch(err){
//      console.log('err',err.message);
//      return res.status(400).json({Status:'Error',Error})
//    }

// }


exports.dissconnect=async(req,res)=>{
   try{
const {user_id,follower_id}=req.body
if(!user_id&&!follower_id){
   return res.status(400).json({status:false,message:'Please provide all the details'})
}else{
   const filter = {
      $or: [
          {
            fromUser: user_id,
            toUser: follower_id
          },
          {
            fromUser: follower_id,
            toUser: user_id
          }
        ]
    };
    const data=await request.findOneAndDelete(filter)
    if(data){
      const response= await connection.findOneAndUpdate({user_id:user_id},{$pull:{connections:{ _id: follower_id }}})
      if(response){
         const response=await usermaster.findOne({_id:follower_id},{_id:0,name:1,profile_img:1})
         return res.status(200).json({status:true,message:'you have unfollowed this account',response})
      }
    }
}
   }catch(err){
     console.log('err',err.message);
     return res.status(400).json({Status:'Error',Error})
   }
}


// exports.getOtherprofile=async(req,res)=>{
//    try{
//       const {_id,viewer_id}=req.body

//       if(_id){ 
//          const result=await usermaster.findOne({_id:_id},{_id:0,profile_img:1,name:1,bio:1,AstroSign:1,Hobbies:1})
//          const Astro=result.AstroSign
//          const Hobbies=result.Hobbies
//          const respons = await usermaster.find({AstroSign:Astro, _id: { $ne: _id }})

//          const respond = await usermaster.find({Hobbies: Hobbies, _id: { $ne: _id } } )
//          const postimages=await post.find({user_id:{$eq:_id}},{_id:0,Post_img:1})
//          console.log(postimages)
//          const userIds = new Set();

//          respons.forEach(user => {
//             userIds.add(user._id.toString());
//          });
//          respond.forEach(user => {
//             userIds.add(user._id.toString());
//          });
//          const matchesProfileCount = userIds.size;
//          console.log(matchesProfileCount);
//          const posts=postimages.length
//          const count=await connection.findOne({user_id:_id},{_id:0,connections:1})
//          const connections=count ? count.connections.length : 0;
//          console.log(connections);
//          const connect=count.connections
//          const data=await usermaster.findOne({_id:viewer_id},{_id:1,token:1,name:1,profile_img:1})
//          console.log(data)
//          const filter = {
//             $and: [
//               {
//                 fromUser:fromUser,
//          toUser:toUser

//               },
//               {
//                 requestPending: true
//               }
//             ]
//           };
//           const requestExists = await request.findOne(filter);
//          if(connect.find(c => c._id.toString() === data._id.toString())){
//             if(result){
//                return res.status(200).json({Status:true,message:'profile fetched successfully',connect,result,matchesProfileCount,connections,posts,postimages, isConnected: true})
//             }else{
//                return res.status(400).json({Status:false,message:'error '})
//             }
//          }
//          else{
//             if(result){
//                return res.status(200).json({Status:true,message:'profile fetched successfully',connect,result,matchesProfileCount,connections,posts,postimages, isConnected: false})
//             }else{
//                return res.status(400).json({Status:false,message:'error '})
//             }
//          }
//       }
//    }catch(err){
//         console.log('err',err.message);
//         return res.status(400).json({Status:'Error',Error})
//    }
// }

 


//  exports.explore = async (req, res) => {
//    try {
//       const {_id} = req.body;
//       const result = await usermaster.findOne({_id: _id}, {_id: 0, profile_img: 1, name: 1, bio: 1, AstroSign: 1, Hobbies: 1});
//       const Astro = result.AstroSign;
//       const Hobbies = result.Hobbies;
//       const astroUsers = await usermaster.find({AstroSign: Astro, _id: {$ne: _id}}, {_id: 1, profile_img: 1, occupation: 1, name: 1});
//       const astroIds = astroUsers.map(doc => doc._id);

//       const hobbiesUsers = await usermaster.find({Hobbies: Hobbies, _id: {$ne: _id}}, {_id: 1, profile_img: 1, occupation: 1, name: 1});
//       const hobbiesIds = hobbiesUsers.map(doc => doc._id);

//       const result1Promise = await usermaster.aggregate([
//          {
//             $match: {
//               _id: {$in: astroIds}
//             }
//           },
//           {
//             $lookup: {
//               from: "posts",
//               localField: "_id",
//               foreignField: "user_id",
//               as: "explore"
//             }
//           },
//           {
//             $project: {
//               _id: 1,
//               name: 1,
//               occupation: 1,
//               profile_img: 1,
//               'explore.Post_img': 1,
//               'explore.Post_discription': 1,
//               'explore._id': 1,
//             },
//           },
//       ]);

//       const result2Promise = await usermaster.aggregate([
//          {
//             $match: {
//               _id: {$in: hobbiesIds}
//             }
//           },
//           {
//             $lookup: {
//               from: "posts",
//               localField: "_id",
//               foreignField: "user_id",
//               as: "explore"
//             }
//           },
//           {
//             $project: {
//               _id: 1,
//               name: 1,
//               occupation: 1,
//               profile_img: 1,
//               'explore.Post_img': 1,
//               'explore.Post_discription': 1,
//               'explore._id': 1,
//             },
//           },
//       ]);

//       const [result1, result2] = await Promise.all([result1Promise, result2Promise]);

//       const combinedResult = [...result1, ...result2];

//       const response = Array.from(new Set(combinedResult.map(JSON.stringify))).map(JSON.parse);
// console.log
//       // Loop through each object in the response and create a new document in the "explore" collection if it doesn't already exist
//       for (const item of response) {
//          const existingExplore = await exploreModel.findOne({user_id:_id,'matchedprofiles._id':item._id});

//          if (!existingExplore) {
//             const newExplore = new exploreModel({
//                user_id:_id,
//                matchedprofiles: item,
//             });

//             const savedExplore = await newExplore.save();

//             if (!savedExplore) {
//                return res.status(400).json({Status: 'Error', message: 'Unable to save explore'});
//             }
//          }
      

//       const results = await exploreModel.find({user_id:_id});
//       if(results){
//          const filter = {
//             $or: [
//                 {
//                   fromUser: _id,
//                   toUser: item._id
//                 },
//                 {
//                   fromUser: item._id,
//                   toUser: _id
//                 }
//               ]
//           };
//           const data=await request.findOne(filter);
//           if(data){
//       const check=data.requestPending
//       console.log(check)
//       if(check==true){
//        await exploreModel.findOneAndUpdate({user_id:_id,'matchedprofiles._id':item._id},{$set:{requested:true,connected:false}})

//       }else{
//          await exploreModel.findOneAndUpdate({user_id:_id,'matchedprofiles._id':item._id},{$set:{connected:true,requested:false}})
//       }
//       const explore=await exploreModel.find({user_id:_id})
//       return res.status(200).json({Status: true, message: 'explore fetched successfully', explore});

//    }else{
//       const explore=await exploreModel.find({user_id:_id})
//       return res.status(200).json({Status: true, message: 'explore fetched successfully', explore});
//    }
// }else{
//    return res.status(400).json({Status:false,message:"couldnot find any request"})
// }
//    } 
// } 
// catch(err){
//      console.log('err',err.message);
//      return res.status(400).json({Status:'Error',Error})
//    }

// }


exports.rejectExplore=async(req,res)=>{
   try{
   const {_id,user_id}=req.body
   if(!user_id&&!_id){
      return res.status(400).json({status:false,message:'Please provide all the details'})
   }else{
      const data = await exploreModel.findOne({user_id:_id,'matchedprofiles._id':user_id})
      const check=data.rejected
      console.log(check)
      if(check==false){
      const response=await exploreModel.findOneAndUpdate({user_id:_id,'matchedprofiles._id':user_id},{$set:{rejected:true}})
      if(response){
         const response=await exploreModel.findOne({'matchedprofiles._id':user_id})
         return res.status(200).json({status:true,message:'You have rejected this Profile',response})
      }else{
         return res.status(400).json({status:false,message:'something error while rejecting'})
      }
   }else{
      return res.status(400).json({status:false,message:'You cannot reject this profile'})
   }
   }
}catch(err){
        console.log('err',err.message);
        return res.status(400).json({Status:'Error',Error})
      }
   }



   exports.getOtherprofile = async (req, res) => {
      try {
        const { _id, viewer_id } = req.body;
    
        if (_id&&viewer_id) {
          const result = await usermaster.findOne(
            {_id:_id},
            {
              _id: 1,
              profile_img: 1,
              name: 1,
              bio: 1,
              AstroSign: 1,
              Hobbies: 1,
              private:1,
              public:1,
              connected:1
            }
          );
          console.log(result)
          const isprivate=result.private
          console.log(isprivate)
          const isConnected=result.connected
          console.log(isConnected)
          const connectedppl=await connection.findOne({user_id:_id})
            const connectedids=connectedppl?.connections?.map(connection => connection._id) || []
      console.log(connectedids)
   const connectIdsStr = connectedids.map(id => id.toString());
   console.log(connectIdsStr);
   if(isprivate===true){
      return res.status(400).json({status:false,message:'This is an Private Account'})
   }
          else if(!isprivate===true&&connectIdsStr.includes(viewer_id)){
          const Astro = result.AstroSign;
          const Hobbies = result.Hobbies;
          const respons = await usermaster.find({
            AstroSign: Astro,
            _id: { $ne: _id },
          });
    
          const respond = await usermaster.find({
            Hobbies: Hobbies,
            _id: { $ne: _id },
          });
          const postimages = await post.find(
            { user_id: { $eq: _id } },
            { _id: 0, Post_img: 1 }
          );
          console.log(postimages);
          const userIds = new Set();
    
          respons.forEach((user) => {
            userIds.add(user._id.toString());
          });
          respond.forEach((user) => {
            userIds.add(user._id.toString());
          });
          const matchesProfileCount = userIds.size;
          console.log(matchesProfileCount);
          const posts = postimages.length;
          const count = await connection.findOne(
            { user_id: _id },
            { _id: 0, connections: 1 }
          );
          const connections = count ? count.connections.length : 0;
          console.log(connections);
          const connect = count ? count.connections : [];
          const data = await usermaster.findOne(
            { _id: viewer_id },
            { _id: 1, token: 1, name: 1, profile_img: 1 }
          );
          console.log(data);
          const filter = {
            $and: [
              {
                fromUser: viewer_id,
                toUser: _id,
              },
              {
                requestPending: true,
              },
            ],
          };
          const requestExists = await request.findOne(filter);
          if (connect.find((c) => c._id.toString() === data._id.toString())) {
            if (result) {
              return res.status(200).json({
                Status: true,
                message: "profile fetched successfully",
                
                result,
                matchesProfileCount,
                connections,
                posts,
                postimages,
                isConnected: true,
                requestExists: requestExists ? true : false,
              });
            } else {
              return res
                .status(400)
                .json({ Status: false, message: "error " });
            }
          } else {
            if (result) {
              return res.status(200).json({
                Status: true,
                message: "profile fetched successfully",
               
                result,
                matchesProfileCount,
                connections,
                posts,
                postimages,
                isConnected: false,
                requestExists: requestExists ? true : false,
              });
            } else {
              return res
                .status(400)
                .json({ Status: false, message: "error " });
            }
          }
         
        }else if(isprivate===false&&isConnected===false){
         const Astro = result.AstroSign;
          const Hobbies = result.Hobbies;
          const respons = await usermaster.find({
            AstroSign: Astro,
            _id: { $ne: _id },
          });
    
          const respond = await usermaster.find({
            Hobbies: Hobbies,
            _id: { $ne: _id },
          });
          const postimages = await post.find(
            { user_id: { $eq: _id } },
            { _id: 0, Post_img: 1 }
          );
          console.log(postimages);
          const userIds = new Set();
    
          respons.forEach((user) => {
            userIds.add(user._id.toString());
          });
          respond.forEach((user) => {
            userIds.add(user._id.toString());
          });
          const matchesProfileCount = userIds.size;
          console.log(matchesProfileCount);
          const posts = postimages.length;
          const count = await connection.findOne(
            { user_id: _id },
            { _id: 0, connections: 1 }
          );
          const connections = count ? count.connections.length : 0;
          console.log(connections);
          const connect = count ? count.connections : [];
          const data = await usermaster.findOne(
            { _id: viewer_id },
            { _id: 1, token: 1, name: 1, profile_img: 1 }
          );
          console.log(data);
          const filter = {
            $and: [
              {
                fromUser: viewer_id,
                toUser: _id,
              },
              {
                requestPending: true,
              },
            ],
          };
          const requestExists = await request.findOne(filter);
          if (connect.find((c) => c._id.toString() === data._id.toString())) {
            if (result) {
              return res.status(200).json({
                Status: true,
                message: "profile fetched successfully",
                
                result,
                matchesProfileCount,
                connections,
                posts,
                postimages,
                isConnected: true,
                requestExists: requestExists ? true : false,
              });
            } else {
              return res
                .status(400)
                .json({ Status: false, message: "error " });
            }
          } else {
            if (result) {
              return res.status(200).json({
                Status: true,
                message: "profile fetched successfully",
               
                result,
                matchesProfileCount,
                connections,
                posts,
                postimages,
                isConnected: false,
                requestExists: requestExists ? true : false,
              });
            } else {
              return res
                .status(400)
                .json({ Status: false, message: "error " });
            }
          }
        }else{
         return res.status(400).json({ Status: "somethig is wrong by passing parametr please verify" });
        }
      }
    } catch (err) {
        console.log("err", err.message);
        return res.status(400).json({ Status: "Error", Error });
      }
    };





   exports.updateProfile=async(req,res)=>{
    try{
        const {_id}=req.body
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
          
             const result = await usermaster.findOneAndUpdate({_id:_id},{$set:{profile_img:profile_img,Hobbies:Hobbies,AstroSign:AstroSign,name:name,bio:bio,dob:dob,occupation:occupation,location:location,gender:gender,addprounous:addprounous,profile:true}},{new:true})
             const user_id = mongoose.Types.ObjectId(_id);
             if(result){
console.log(user_id)
             const posts = await post.updateMany({
               "likedpeopledata._id": user_id
             },{$set:{'likedpeopledata.$.profile_img':profile_img,'likedpeopledata.$.name':name}});
             console.log(posts)
         const result = await usermaster.findOne({_id:_id})
         const likeposts=await likepost.updateOne({
          "likesofposts._id": user_id
        },{$set:{'likesofposts.$.profile_img':profile_img,'likedpeopledata.$.name':name}});

        const comment= await comments.updateMany({
          "commentdetails._id": user_id
        },{$set:{'commentdetails.profile_img':profile_img,'commentdetails.name':name}});
        console.log(comment)
        
        const commentlike= await comments.updateMany({
          "commentlikerDetails._id": user_id
        },{$set:{'commentlikerDetails.$.profile_img':profile_img,'commentlikerDetails.$.name':name}});

        const replycomments=await replycomment.updateMany({
          "commentdetails._id": user_id
        },{ $set: { "commentdetails.profile_img": profile_img, "commentdetails.name": name } })

        const replycommentslike=await replycomment.updateMany({
          "commentlikerDetails._id": user_id
        },{$set:{'commentlikerDetails.$.profile_img':profile_img,'commentlikerDetails.$.name':name}})

        const connectrequest=await connection.updateMany({
          "totalrequest._id": user_id
        },{$set:{'totalrequest.$.profile_img':profile_img,'totalrequest.$.name':name}})

        const connectconnectios=await connection.updateMany({
          "connections._id": user_id
        },{$set:{'connections.$.profile_img':profile_img,'connections.$.name':name}})



        const response=await usermaster.findOne({_id:_id})
             return res.status(200).json({Status:true,message:'profile ctreated successfully',response})
             }
         }
        
        
      catch(err){
         console.log('err',err.message);
         return res.status(400).json({Status:'Error',Error})
      }
 }

// exports.updateProfile=async(req,res)=>{
//   try{
//       const {_id}=req.body
//       const name=req.body.name
//       const bio=req.body.bio
//       const dob=req.body.dob
//       const occupation=req.body.occupation
//       const location=req.body.location
//       const gender=req.body.gender
//       const addpronous=req.body.addpronous
//       const AstroSign=req.body.AstroSign
//       const Hobbies=req.body.Hobbies
//       const profile_img=req.file.filename
                
        
//            const result = await usermaster.findOneAndUpdate({_id:_id},{$set:{profile_img:profile_img,Hobbies:Hobbies,AstroSign:AstroSign,name:name,bio:bio,dob:dob,occupation:occupation,location:location,gender:gender,addpronous:addpronous,profile:true}},{new:true})
//            const user_id = mongoose.Types.ObjectId(_id);
//            if(result){
// console.log(user_id)

// const comment = await comments.updateMany(
//   {
//     "commentdetails._id": user_id,
//   },
//   {
//     $set: {
//       "commentdetails.profile_img": profile_img,
//       "commentdetails.$.name": name,
//     },
//   }
// );
// console.log(comment);
      


//            return res.status(200).json({Status:true,message:'profile ctreated successfully',comment})
//            }
       

//       }
//     catch(err){
//        console.log('err',err.message);
//        return res.status(400).json({Status:'Error',Error})
//     }
// }

// exports.explore = async (req, res) => {
//   try {
//      const {_id} = req.body;
// const data= await usermaster.findOne({_id:_id})
// const isprivate=data.private
// if(isprivate===true){
// return res.status(400).json({Status:false, message: 'This is A'});
// }

//      const result = await usermaster.findOne({_id: _id}, {_id: 0, profile_img: 1, name: 1, bio: 1, AstroSign: 1, Hobbies: 1});
//      const Astro = result.AstroSign;
//      const Hobbies = result.Hobbies;
//      const astroUsers = await usermaster.find({AstroSign: Astro, _id: {$ne: _id},private:false,connected:false}, {_id: 1, profile_img: 1, occupation: 1, name: 1});
//      const astroIds = astroUsers.map(doc => doc._id);

//      const hobbiesUsers = await usermaster.find({Hobbies: Hobbies, _id: {$ne: _id},private:false,connected:false}, {_id: 1, profile_img: 1, occupation: 1, name: 1});
//      const hobbiesIds = hobbiesUsers.map(doc => doc._id);
    
//      const result1Promise = await usermaster.aggregate([
//         {
//            $match: {
//              _id: {$in: astroIds}
//            }
//          },
//          {
//            $lookup: {
//              from: "posts",
//              localField: "_id",
//              foreignField: "user_id",
//              as: "explore"
//            }
//          },
//          {
//            $project: {
//              _id: 1,
//              name: 1,
//              occupation: 1,
//              profile_img: 1,
//              'explore.Post_img': 1,
//              'explore.Post_discription': 1,
//              'explore._id': 1,
//              'explore.likedpeopledata._id':1
//            },
//          },
//      ]);

//      const result2Promise = await usermaster.aggregate([
//         {
//            $match: {
//              _id: {$in: hobbiesIds}
//            }
//          },
//          {
//            $lookup: {
//              from: "posts",
//              localField: "_id",
//              foreignField: "user_id",
//              as: "explore"
//            }
//          },
//          {
//            $project: {
//              _id: 1,
//              name: 1,
//              occupation: 1,
//              profile_img: 1,
//              'explore.Post_img': 1,
//              'explore.Post_discription': 1,
//              'explore._id': 1,
//              'explore.likedpeopledata._id':1
//            },
//          },
//      ]);

//      const [result1, result2] = await Promise.all([result1Promise, result2Promise]);

//      const combinedResult = [...result1, ...result2];

//      const response = Array.from(new Set(combinedResult.map(JSON.stringify))).map(JSON.parse);
//     // console.log(response)
//     if(response){
//      for (const item of response) {
       
//         const existingExplore = await exploreModel.findOne({ user_id: _id, 'matchedprofiles._id': item._id});
//         if (!existingExplore) {
//           const newExplore = new exploreModel({
//             user_id:_id,
//             matchedprofiles:item
//           })

//            const savedExplore = await newExplore.save();

//            if (!savedExplore) {
//               return res.status(400).json({Status: 'Error', message: 'Unable to save explore'});
//            }
//         }else if (existingExplore){
//            const exists=await exploreModel.findOneAndUpdate({ user_id: _id, 'matchedprofiles._id': item._id },
//      { $set: { matchedprofiles: item } })
//            console.log(exists)
//         }
//      }
//      const results = await exploreModel.find({user_id:_id},{_id:0,matchedprofiles:1});
//      const ids=results.map(doc=>doc.matchedprofiles._id)
   
//      if(results){
//         const filter = {
//            $and: [
//                {
//                  fromUser: _id,
//                  toUser: {$in:ids}
//                }
//              ]
//          };
//          const data=await request.find(filter);
//         // console.log(data)
         
//         const matchedProfileIds = data.flatMap(doc => [
//            mongoose.Types.ObjectId(doc.toUser).toString()
//          ]);
//          //console.log(matchedProfileIds)
//          const check = data.filter(doc => doc.requestPending === true);
// //console.log(check);
// const toUserIds = check.map(doc => doc.toUser.toString());
// //console.log(toUserIds);
// const checks = data.filter(doc => doc.requestPending === false);
// //console.log(checks);
// const toUserId = checks.map(doc => doc.toUser.toString());
// //console.log(toUserId);
//          if(data.length>0&&check.length>0){
//               await exploreModel.updateMany({user_id:_id,'matchedprofiles._id':{$in:toUserIds}},{$set:{requested:true,connected:false}})
//               const results=await exploreModel.find({user_id:_id,rejected:false},{_id:0,matchedprofiles:1,requested:1,connected:1})
//              return res.status(200).json({Status: true, message: 'explore fetched successfully', results});
//            }else if (data.length>0&&checks.length>0){
//               await exploreModel.updateMany({user_id:_id,'matchedprofiles._id':{$in:toUserId}},{$set:{connected:true,requested:false}})
//               const resultss=await exploreModel.find({user_id:_id,rejected:false},{_id:0,matchedprofiles:1,requested:1,connected:1})
//            return res.status(200).json({Status: true, message: 'explore fetched successfully', resultss});
//            }else{
//               await exploreModel.updateMany({user_id:_id},{$set:{connected:false,requested:false}})
//               const resultsss=await exploreModel.find({user_id:_id,rejected:false},{_id:0,matchedprofiles:1,requested:1,connected:1})
//            return res.status(200).json({Status: true, message: 'explore fetched successfully', resultsss});
//            }
//   }
  
// }
// }catch(err){
//     console.log('err',err.message);
//     return res.status(400).json({Status:'Error',Error})
//   }

// }


exports.explore = async (req, res) => {
  try {
     const {_id} = req.body;
     const user_ids=mongoose.Types.ObjectId(_id)
     const seeinconnections=await connection.find({'connections._id':user_ids},{_id:0,user_id:1})
     console.log(seeinconnections)
     const user_ids_array = seeinconnections.map(connection => connection.user_id);
const users = await usermaster.find({ _id: { $in: user_ids_array },connected:true },{_id:1});

const user_id_strings = users.map(user => user._id);
console.log(user_id_strings)

     const result = await usermaster.findOne({_id: _id}, {_id: 0, profile_img: 1, name: 1, bio: 1, AstroSign: 1, Hobbies: 1});
     const Astro = result.AstroSign;
     const Hobbies = result.Hobbies;
     const astroUsers = await usermaster.find({AstroSign: Astro, _id: {$ne: _id},private:false,connected:false,_id: {$in: user_id_strings}}, {_id: 1, profile_img: 1, occupation: 1, name: 1});
     const astroIds = astroUsers.map(doc => doc._id);

     const hobbiesUsers = await usermaster.find({Hobbies: Hobbies, _id: {$ne: _id},private:false,connected:false,_id: {$in: user_id_strings}}, {_id: 1, profile_img: 1, occupation: 1, name: 1});
     const hobbiesIds = hobbiesUsers.map(doc => doc._id);
    
     const result1Promise = await usermaster.aggregate([
        {
           $match: {
             _id: {$in: astroIds}
           }
         },
         {
           $lookup: {
             from: "posts",
             localField: "_id",
             foreignField: "user_id",
             as: "explore"
           }
         },
         {
           $project: {
             _id: 1,
             name: 1,
             occupation: 1,
             profile_img: 1,
             'explore.Post_img': 1,
             'explore.Post_discription': 1,
             'explore._id': 1,
             'explore.likedpeopledata._id':1
           },
         },
     ]);

     const result2Promise = await usermaster.aggregate([
        {
           $match: {
             _id: {$in: hobbiesIds}
           }
         },
         {
           $lookup: {
             from: "posts",
             localField: "_id",
             foreignField: "user_id",
             as: "explore"
           }
         },
         {
           $project: {
             _id: 1,
             name: 1,
             occupation: 1,
             profile_img: 1,
             'explore.Post_img': 1,
             'explore.Post_discription': 1,
             'explore._id': 1,
             'explore.likedpeopledata._id':1
           },
         },
     ]);

     const [result1, result2] = await Promise.all([result1Promise, result2Promise]);

     const combinedResult = [...result1, ...result2];

     const response = Array.from(new Set(combinedResult.map(JSON.stringify))).map(JSON.parse);
    // console.log(response)
    if(response){
     for (const item of response) {
       
        const existingExplore = await exploreModel.findOne({ user_id: _id, 'matchedprofiles._id': item._id});
        if (!existingExplore) {
          const newExplore = new exploreModel({
            user_id:_id,
            matchedprofiles:item
          })

           const savedExplore = await newExplore.save();

           if (!savedExplore) {
              return res.status(400).json({Status: 'Error', message: 'Unable to save explore'});
           }
        }else if (existingExplore){
         
           const exists=await exploreModel.updateMany({ user_id: _id, 'matchedprofiles._id': item._id },
     { $set: { matchedprofiles: item } })
    
     }
     const results = await exploreModel.find({user_id:_id},{_id:0,matchedprofiles:1});
     const ids=results.map(doc=>doc.matchedprofiles._id)
   
     if(results){
        const filter = {
           $and: [
               {
                 fromUser: _id,
                 toUser: {$in:ids}
               }
             ]
         };
         const data=await request.find(filter);
        // console.log(data)
         
        const matchedProfileIds = data.flatMap(doc => [
           mongoose.Types.ObjectId(doc.toUser).toString()
         ]);
         //console.log(matchedProfileIds)
         const check = data.filter(doc => doc.requestPending === true);
//console.log(check);
const toUserIds = check.map(doc => doc.toUser.toString());
//console.log(toUserIds);
const checks = data.filter(doc => doc.requestPending === false);
//console.log(checks);
const toUserId = checks.map(doc => doc.toUser.toString());
//console.log(toUserId);
         if(data.length>0&&check.length>0){
              await exploreModel.updateMany({user_id:_id,'matchedprofiles._id':{$in:toUserIds}},{$set:{requested:true,connected:false}})
              const results=await exploreModel.find({user_id:_id,rejected:false},{_id:0,matchedprofiles:1,requested:1,connected:1})
             return res.status(200).json({Status: true, message: 'explore fetched successfully', results});
           }else if (data.length>0&&checks.length>0){
              await exploreModel.updateMany({user_id:_id,'matchedprofiles._id':{$in:toUserId}},{$set:{connected:true,requested:false}})
              const resultss=await exploreModel.find({user_id:_id,rejected:false},{_id:0,matchedprofiles:1,requested:1,connected:1})
           return res.status(200).json({Status: true, message: 'explore fetched successfully', resultss});
           }else{
              await exploreModel.updateMany({user_id:_id},{$set:{connected:false,requested:false}})
              const resultsss=await exploreModel.find({user_id:_id,rejected:false},{_id:0,matchedprofiles:1,requested:1,connected:1})
           return res.status(200).json({Status: true, message: 'explore fetched successfully', resultsss});
           }
  }
  
}
}
}catch(err){
    console.log('err',err.message);
    return res.status(400).json({Status:'Error',Error})
  }

}