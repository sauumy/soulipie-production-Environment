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
      
  const userIds = new Set();

  respons.forEach(user => {
    userIds.add(user._id.toString());
  });
  respond.forEach(user => {
    userIds.add(user._id.toString());
  });
  const matchesProfileCount = userIds.size;
  
     const posts=results.length
     
     
                return res.status(200).json({Status:true,message:'profile fetched successfully',result,matchesProfileCount,Connection,posts})
  }catch(err){
        
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
  
   return res.status(400).json({Status:'Error',Error})
}
}
exports.savePost = async (req, res) => {
   try {
     const { post_id, user_id } = req.body;
     if (!post_id || !user_id) {
       return res.status(400).json({ Status: false, message: 'Please provide all the details' });
     } else {
      const datas=await post.findOne({_id:post_id})
      const usersData=await usermaster.findOne({_id:user_id},{_id:1,name:1,profile_img:1,addprounous:1})
      if(datas){
       const user = await bookmarks.findOne({ user_id: usersData ,saved:datas}); 
       if (!user) {
         const data = new bookmarks({
           user_id: usersData,
           saved: datas 
         });
         const response = await data.save()

         return res.status(200).json({ Status: true, message: 'Saved post successfully', response });
       } 
       else if (user) {
         const response=await bookmarks.findOneAndDelete({user_id:usersData,saved:datas})
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
 
   return res.status(400).json({ Status: 'Error', message: err.message });
 }
}
exports.rejectExplore=async(req,res)=>{
   try{
   const {_id,user_id}=req.body
   if(!user_id&&!_id){
      return res.status(400).json({status:false,message:'Please provide all the details'})
   }else{
      const data = await exploreModel.findOne({user_id:_id,'matchedprofiles._id':user_id})
      const check=data.rejected
     
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
              connected:1,
              blockContact:1,
              addprounous:1
            }
          );
         
          const isprivate=result.private
         
          const isConnected=result.connected
          
          const isPublic=result.public
          const connectedppl=await connection.findOne({user_id:_id})
            const connectedids=connectedppl?.connections?.map(connection => connection._id) || []
      
   const connectIdsStr = connectedids.map(id => id.toString());
 
   const blockedIds=result.blockContact
  
   if(blockedIds.includes(viewer_id)){
    return res.status(400).json({status:false,message:'t'})
   }
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
       
          const userIds = new Set();
    
          respons.forEach((user) => {
            userIds.add(user._id.toString());
          });
          respond.forEach((user) => {
            userIds.add(user._id.toString());
          });
          const matchesProfileCount = userIds.size;
          
          const posts = postimages.length;
          const count = await connection.findOne(
            { user_id: _id },
            { _id: 0, connections: 1 }
          );
          const connections = count ? count.connections.length : 0;
       
          const connect = count ? count.connections : [];
          const data = await usermaster.findOne(
            { _id: viewer_id },
            { _id: 1, token: 1, name: 1, profile_img: 1 }
          );
       
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
         
        }else if(isPublic===true){
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
          
          const userIds = new Set();
    
          respons.forEach((user) => {
            userIds.add(user._id.toString());
          });
          respond.forEach((user) => {
            userIds.add(user._id.toString());
          });
          const matchesProfileCount = userIds.size;
         
          const posts = postimages.length;
          const count = await connection.findOne(
            { user_id: _id },
            { _id: 0, connections: 1 }
          );
          const connections = count ? count.connections.length : 0;
          
          const connect = count ? count.connections : [];
          const data = await usermaster.findOne(
            { _id: viewer_id },
            { _id: 1, token: 1, name: 1, profile_img: 1 }
          );
         
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
       
        return res.status(400).json({ Status: "Error", Error });
      }
}
exports.matchedList = async (req, res) => {
  try {
    const { user_id } = req.body;
    if (!user_id) {
      return res.status(400).json({ status: false, message: 'Please provide all the details' });
    } else {
      const result = await usermaster.findOne({ _id: user_id });
      const Astro = result.AstroSign;
      const Hobbies = result.Hobbies;
      
      const response = await usermaster.find({
        AstroSign: Astro,
        _id: { $ne: user_id },
      });

      const respond = await usermaster.find({
        Hobbies: Hobbies,
        _id: { $ne: user_id },
      });

      const combinedResult = response.concat(respond);

      // Remove duplicates based on _id property
      const uniqueResult = combinedResult.filter((item, index, self) =>
        index === self.findIndex((i) => i._id.toString() === item._id.toString())
      );

      if (uniqueResult.length > 0) {
        return res.status(200).json({ status: true, message: "Matched profiles fetched successfully", uniqueResult });
      } else {
        return res.status(400).json({ status: false, message: "Couldn't find any matched profiles" });
      }
    }
  } catch (err) {
   
    return res.status(400).json({ status: 'Error', message: 'Something went wrong', error: err });
  }
}
exports.getAllProfile=async(req,res)=>{
  try{
      const result = await usermaster.find({profile:'true'})
               return res.status(200).json({Status:true,message:'profile fetched successfully',result})
  }catch(err){
      
       return res.status(400).json({Status:'Error',Error})
    }

}
exports.dissconnect=async(req,res)=>{
  try{
const {user_id,follower_id}=req.body
if(!user_id&&!follower_id){
  return res.status(400).json({status:false,message:'Please provide all the details'})
}else{
 const follower=await usermaster.findOne({_id:user_id})
 const name=follower.name
 const profile_img=follower.profile_img
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
   }
   const data=await request.findOneAndDelete(filter)

   if(data){
    const follower=await usermaster.findOne({_id:follower_id},{_id:1,token:1,name:1,profile_img:1})
 
    const response = await connection.findOneAndUpdate(
      { user_id: user_id },
      { $pull: { connections:follower} },
      { new: true }
    );
     
     if(response){
       
       const notifications={
         title : 'Soulipie',
         body : `${name} accepted your connection request`  ,
         icon : profile_img
 }
await notification.findOneAndDelete({user_id:follower_id,accpeted:notifications})
        const response=await usermaster.findOne({_id:follower_id},{_id:0,name:1,profile_img:1})
        return res.status(200).json({status:true,message:'you have unfollowed this account',response})
     }else{
      return res.status(400).json({Status:'false'})
     }
   }else{
    return res.status(400).json({Status:'Error',Error})
   }
}
  }catch(err){
   
    return res.status(400).json({Status:'Error',Error})
  }
}
exports.explore = async (req, res) => {
  try {
     const {_id} = req.body;
     const user_ids=mongoose.Types.ObjectId(_id)
     const seeinconnections = await connection.find({'connections._id': user_ids,connected:true},{_id:0,user_id:1})
   
     const user_ids_array = seeinconnections.map(connection => connection.user_id);
     const users = await usermaster.find({_id:user_ids_array},{_id:1});
const user_id_strings = users.map(user => user._id);

     const result = await usermaster.findOne({_id: _id}, {_id: 0, profile_img: 1, name: 1, bio: 1, AstroSign: 1, Hobbies: 1});
     const Astro = result.AstroSign;
     const Hobbies = result.Hobbies;
     const astroUsers = await usermaster.find({AstroSign: Astro, _id: { $ne: _id },private:false,connected:false}, {_id: 1, profile_img: 1, occupation: 1, name: 1});
     const astroIds = astroUsers.map(doc => doc._id);

     const hobbiesUsers = await usermaster.find({Hobbies: Hobbies,_id: { $ne: _id },private:false,connected:false}, {_id: 1, profile_img: 1, occupation: 1, name: 1});
     const hobbiesIds = hobbiesUsers.map(doc => doc._id);
    
     const result1Promise = await usermaster.aggregate([
      {
        $match: {
          $or: [
            { _id: { $in: astroIds } },
            { $expr: { $and: [ { $not: { $isArray: "$user_ids_array" } }, { $eq: [ "$user_ids_array", [] ] } ] } }
          ]
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
             addprounous: 1,
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
          $or: [
            { _id: { $in: hobbiesIds } },
            { $expr: { $and: [ { $not: { $isArray: "$user_ids_array" } }, { $eq: [ "$user_ids_array", [] ] } ] } }
          ]
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
             addprounous: 1,
             profile_img: 1,
             'explore.Post_img': 1,
             'explore.Post_discription': 1,
             'explore._id': 1,
             'explore.likedpeopledata._id':1
           },
         },
     ])
     const [result1, result2] = await Promise.all([result1Promise, result2Promise]);
     const combinedResult = [...result1, ...result2];
     const response = Array.from(new Set(combinedResult.map(JSON.stringify))).map(JSON.parse);
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
          
const idss=await exploreModel.find({},{_id:0,'matchedprofiles._id':1})
const ids = idss.map(item => item.matchedprofiles._id);

const datss=await usermaster.find({_id:{$in:ids},private:true},{_id:1})

const mappedIds = datss.map(item => item._id.toString());

const deletes=await exploreModel.deleteMany({'matchedprofiles._id':{$in:mappedIds}})

        }
     }
     const results = await exploreModel.find({user_id:_id},{_id:0,matchedprofiles:1});
     const ids=results.map(doc=>doc.matchedprofiles._id)
   
     
        const filter = {
           $and: [
               {
                 fromUser: _id,
                 toUser: {$in:ids}
               }
             ]
         };
         const data=await request.find(filter);
       
         
        const matchedProfileIds = data.flatMap(doc => [
           mongoose.Types.ObjectId(doc.toUser).toString()
         ]);
         
const check = data.filter(doc => doc.requestPending === true);

const toUserIds = check.map(doc => doc.toUser.toString());

const checks = data.filter(doc => doc.requestPending === false);

const toUserId = checks.map(doc => doc.toUser.toString());

const tousersids=data.map(doc=>doc.toUser.toString())

         if(data.length>0){
              await exploreModel.updateMany({user_id:_id,'matchedprofiles._id':{$in:toUserIds}},{$set:{requested:true,connected:false}})
              
                      
              await exploreModel.updateMany({user_id:_id,'matchedprofiles._id':{$in:toUserId}},{$set:{connected:true,requested:false}})
             
          
              const allToUserIds = [...toUserIds, ...toUserId];
              
              await exploreModel.updateMany({user_id:_id,'matchedprofiles._id':{$nin:allToUserIds}},{$set:{connected:false,requested:false}})


              const result=await exploreModel.find({user_id:_id,rejected:false},{_id:0,matchedprofiles:1,requested:1,connected:1}).sort({ createdAt: -1 })
              return res.status(200).json({Status:true,message:'Explore Fetched Successfuly',result})
           }else{
            const allToUserIds = [...toUserIds, ...toUserId];
              
              await exploreModel.updateMany({user_id:_id,'matchedprofiles._id':{$nin:allToUserIds}},{$set:{connected:false,requested:false}})
            const result=await exploreModel.find({user_id:_id,rejected:false},{_id:0,matchedprofiles:1,requested:1,connected:1}).sort({ createdAt: -1 })
              return res.status(200).json({Status:true,message:'Explore Fetched Successfuly',result})
           
  }
  

}catch(err){
    
    return res.status(400).json({Status:'Error',Error})
  }

}
// exports.getSavedPost = async (req, res) => {
//   try {
//     const { _id } = req.params;
//     const result = await bookmarks.find({ user_id: _id}, { _id: 0, saved: 1 });
//     const mappedResult = result.map(item => item.saved.user_id);
//     const userResult = await usermaster.find({ _id: { $in: mappedResult }, private: true });
// const seeinconnections=connection.find({"connections._id":_id},{_id:0,user_id:1})
// const user_ids_array = seeinconnections.map(connection => connection.user_id);
// const users = await usermaster.find({ _id: { $in: user_ids_array }, connected: true }, { _id: 1 });
// const user_id_strings = users.map(user => user._id)


//     if (result) {
//       const savedObjectsToDelete = result.filter(item => userResult.some(user => user._id.toString() === item.saved.user_id.toString()));
//       for (const savedObj of savedObjectsToDelete) {
//         await bookmarks.deleteOne({ 'saved._id': savedObj.saved._id });
//       }
//       const updatedResult = await bookmarks.find({ user_id: _id }, { _id: 0, saved: 1 });
//       return res.status(200).json({ Status: true, message: 'Saved fetch successfully', result:updatedResult });
//     } else {
//       return res.status(400).json({ Status: false, message: 'Error while fetching the saved' });
//     }
//   } catch (err) {
//     return res.status(400).json({ Status: 'Error', Error: err });
//   }
// }
exports.getSavedPost = async (req, res) => {
  try {
    const { _id } = req.params;
    const userdata=await usermaster.findOne({_id:_id},{_id:1,name:1,profile_img:1,addprounous:1})
const result = await bookmarks.find({ user_id: userdata});
      return res.status(200).json({ Status: true, message: 'Saved fetch successfully', result });
  } catch (err) {
    
    return res.status(400).json({ Status: 'Error', Error: err });
  }
}
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
      const check = await usermaster.find({}, { _id: 0, name: 1 });
      const names = check.map(user => user.name);
      
           const result = await usermaster.findOneAndUpdate({_id:_id},{$set:{profile_img:profile_img,Hobbies:Hobbies,AstroSign:AstroSign,name:name,bio:bio,dob:dob,occupation:occupation,location:location,gender:gender,addprounous:addprounous,profile:true}},{new:true})
           const user_id = mongoose.Types.ObjectId(_id);
           if(result){
           const posts = await post.updateMany({
             "likedpeopledata._id": user_id
           },{$set:{'likedpeopledata.$.profile_img':profile_img,'likedpeopledata.$.name':name}});
          
       const result = await usermaster.findOne({_id:_id})
       const likeposts=await likepost.updateOne({
        "likesofposts._id": user_id
      },{$set:{'likesofposts.$.profile_img':profile_img,'likedpeopledata.$.name':name}});

      const comment= await comments.updateMany({
        "commentdetails._id": user_id
      },{$set:{'commentdetails.profile_img':profile_img,'commentdetails.name':name}});
    
      
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

      const request=await notification.updateMany({requested_id:user_id},
        { $set: { "request.body":`${name} would like to connect with you`, "request.icon": profile_img } }, { new: true })
        const accept=await notification.updateMany({accpeted_id:user_id},
          { $set: { "accpeted.body": `${name} accepted your connection request`, "accpeted.icon": profile_img } }, { new: true })
          const likepostss=await notification.updateMany({post_liker_id:user_id},
            { $set: { "likespost.body": `${name} Liked your Post`, "likespost.icon": profile_img } }, { new: true })
            const commentssss=await notification.updateMany({post_commenter_id:user_id},
              { $set: { "comment.body": `${name} Commented On your Post`, "comment.icon": profile_img } }, { new: true })
              const commentlikessww=await notification.updateMany({commente_liker_id:user_id},
                { $set: { "likecomment.body": `${name} Liked your Comment`, "likecomment.icon": profile_img } }, { new: true })

                const commentlikessw=await notification.updateMany({replyCommenter_id:user_id},
                  { $set: { "replyComment.body": `${name} Commented On your Post`, "replyComment.icon": profile_img } }, { new: true })
                const commentlikeswws=await notification.updateMany({mentioner_id:user_id},
                  { $set: { "mentioned.body": `${name} Mentioned You On Comment`, "mentioned.icon": profile_img } }, { new: true })
                  const commentlikesws=await notification.updateMany({replyCommente_liker_id:user_id},
                    { $set: { "replyCommentlike.body": `${name} Liked your Comment`, "replyCommentlike.icon": profile_img } }, { new: true })
                    const commentlikefasws=await notification.updateMany({tagged_post_userid:user_id},
                      { $set: { "tagged_post.body": `${name} Tagged In Their Post`, "tagged_post.icon": profile_img } }, { new: true })
                
      const response=await usermaster.findOne({_id:_id})
           return res.status(200).json({Status:true,message:'Profile Updated successfully',response})
           }else{
            return res.status(200).json({Status:false,message:'error while updated the profile'})
           }
       
      }       
    catch(err){
      
       return res.status(400).json({Status:'Error',Error})
    }
}
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
    const profile_img=req.file.filename 
    const check = await usermaster.find({}, { _id: 0, name: 1 });
      const names = check.map(user => user.name);
     

      if(!_id&&!name&&!bio&&!dob&&!occupation&&!location&&!gender&&!addprounous&&!req.file){
        return res.status(406).send({Status:false,message:'Please Provide All Details'})
      }
      else if(!names.includes(name)){
          const result = await usermaster.findOneAndUpdate({_id:_id},{$set:{profile_img:profile_img,profile:true,name:name,bio:bio,dob:dob,
             occupation:occupation,location:location,gender:gender,addprounous:addprounous}},{new:true})
          if(result){

       const result = await usermaster.findOne({_id:_id})
          return res.status(200).json({Status:true,message:'Profile created successfully',result})
       }else{
          return res.status(406).send({Status:false,message:'not found anything'})
       }
      }else{
        return res.status(406).send({Status:false,message:'This Name is Already Exists'})
      }
    }
    catch(err){
      console.log(err)
       return res.status(400).json({Status:'Error',message:"Check All The Details",Error})
    }
}
exports.createProfile1=async(req,res)=>{
  try{
    const _id=req.body._id
     const AstroSign=req.body.AstroSign
    const Hobbies=req.body.Hobbies

          const result = await usermaster.findOneAndUpdate({_id:_id},{$set:{AstroSign:AstroSign,Hobbies:Hobbies}},{new:true})
          if(result){

       const result = await usermaster.findOne({_id:_id})
          return res.status(200).json({Status:true,message:'Profile created successfully',result})
       }else{
          return res.status(406).send({Status:false,message:'not found anything'})
       }
    }
    catch(err){
      
       return res.status(400).json({Status:'Error',Error})
    }
}