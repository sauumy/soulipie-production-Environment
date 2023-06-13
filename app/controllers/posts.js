const usermaster=require("../models/registration");
const Astro=require('../models/astrosign')
const Hobbies = require("../models/hobbies");
const post=require("../models/posts")
const admin = require('firebase-admin');
const comments=require('../models/comments')
const replycomments=require('../models/replycomment')
const likepost=require('../models/likespost')
const reportpost=require('../models/reportpost')
const connectSchema=require('../models/connection');
const connection = require("../models/connection");
const notification=require('../models/notification')
const blockepost=require('../models/blockpost')
const feedSchema=require('../models/feedback')
const mongoose=require('mongoose');
const e = require("express");
exports.createPostImg=async(req,res)=>{
    try{
        if(!req.body.user_id&&!req.files){
            return res.status(400).json({Status:false,message:'please select image'}) 
        }
else if(req.files && req.files.length > 0){
        user_id=req.body.user_id,
        Post_img=req.files.map(file => file.filename)
        const posts = Post_img.map(p => new post({
          user_id,
          Post_img: p,
        }));
    const response=await post.insertMany(posts)
    if(response){
      return res.status(200).json({Status:true,message:'post ctreated successfully',response})
  } else{
      return res.status(400).json({Status:false,message:'couldnot created  successfully'})
  } 
   
}else{
    return res.status(400).json({Status:false,message:'please select file'})
}
    }catch(err){

         return res.status(400).json({Status:'Error',Error})
      }
}
exports.editPostDetails=async(req,res)=>{
  try{
  const {post_id,Post_discription,Tagged_people}=req.body  
  if(post_id&&Post_discription&&!Tagged_people){
  const respons=await post.findOneAndUpdate({_id:post_id},{$set:{Post_discription:Post_discription}})
  if(respons){  
  const response=await post.findOne({_id:post_id})
    res.status(200).json({status:true,message:'Post edited Successfully',response})
  }else{
    return res.status(400).json({Status:false,message:'could not update details'})
  }
  }else if(post_id&&Tagged_people&&!Post_discription){
  const data=await post.findOneAndUpdate({_id:post_id},{$push:{Tagged_people:{ $each: Tagged_people }}})
  if(data){  
    const names=await usermaster.find({name:{$in:Tagged_people}})
    const userIds = names.map(doc => doc._id);
const userTokens = names.map(doc => doc.token);

    const response=await post.findOne({_id:post_id})
      res.status(200).json({status:true,message:'Post edited Successfully',response})
    }else{
      return res.status(400).json({Status:false,message:'could not update details'})
    }
  }else{
    const respons=await post.findOneAndUpdate({_id:post_id},{$set:{Post_discription:Post_discription}})
    const data=await post.findOneAndUpdate({_id:post_id},{$push:{Tagged_people:{ $each: Tagged_people }}})
    if(respons&&data){  
      const names=await usermaster.find({name:{$in:Tagged_people}})
      const userIds = names.map(doc => doc._id);
  const userTokens = names.map(doc => doc.token);
  
  
      const response=await post.findOne({_id:post_id})
        res.status(200).json({status:true,message:'Post edited Successfully',response})
      }else{
        return res.status(400).json({Status:false,message:'could not update details'})
      }
  }  
  }catch(err){
    
       return res.status(400).json({Status:'Error',Error})
    }
}
exports.editPostImg=async(req,res)=>{
  try{
    const{post_id}=req.body
    if(!post_id){
      return res.status(400).json({Status:false,message:'please select every feild'}) 
    }else{
    const respons=await post.findOneAndUpdate({_id:post_id},{$set:{Post_img:req.file.filename}})
if(respons){
  const response=await post.findOne({_id:post_id})
  res.status(200).json({status:true,message:'Post fetched Successfully',response})
}else{
  res.status(200).json({status:true,message:'Post couldnot be edited '})
}
    }
  }catch(err){
    return res.status(400).json({Status:'Error',Error})
  }
}

// exports.getAllPostsofMe=async(req,res)=>{
//     try{
//          const{user_id}=req.body

//         const id=await usermaster.findOne({_id:user_id})
//        const results= await usermaster.aggregate([
//         {
//           $match: {
//             _id: id._id
//           }
//         },
//         {
//           $lookup: {
//             from: 'posts',
//             localField: '_id',
//             foreignField: 'user_id',
//             as: 'posts',
//           },
//         },
//         {
//           $project: {
//             _id: 0,
//             name:1,
//             profile_img:1,
//             occupation:1,
//             'posts.Post_img': 1,
//           'posts.Post_discription':1,
//           'posts._id':1,
//           'posts.totallikesofpost':1,
//           'posts.totalcomments':1,
//           'posts.likedpeopledata':1
            
//           },
//         },
//       ]);

          
//           if(results){
//         return res.status(200).json({Status:true,message:'post fetched successfully',results})
//           }else{
//             return res.status(400).json({Status:false,message:'error fechting the file'})
//           }
//     }catch(err){
        
//          return res.status(400).json({Status:'Error',Error})
//       }
// }

exports.deletePost=async(req,res)=>{
  try{
const {_id}=req.body
const response=await post.findOneAndDelete({_id:_id})
if(response){
  await comments.deleteMany({post_id:_id})
  return res.status(200).json({Status:true,message:'post Deleted successfully',response})
}else{
  return res.status(400).json({Status:false,message:'error fechting the post'})
}
}catch(err){
 
  return res.status(400).json({Status:'Error',Error})
}
}

exports.reportPost=async(req,res)=>{
  try{
const{reporter_id,post_id,reportreason,reporter_email}=req.body
if(!reporter_id&&!post_id&&!reportreason&&!reporter_email){
  return res.status(400).json({Status:false,message:'Please provide all the details'})
}
else{
  const report=new reportpost({
    reporter_id:reporter_id,
    post_id:post_id,
    reportreason:reportreason,
    reporter_email:reporter_email
  })
  const response=await report.save()
  if(response){
    
    return res.status(200).json({Status:true,message:'Post reported  successfully',response})
  }else{
    return res.status(400).json({Status:false,message:'some error while editing'})
  }
}
  }catch(err){
   
    return res.status(400).json({Status:'Error',Error})
  }
}

exports.viewpost = async (req, res) => {
  try {
    const { post_id ,viewer_id} = req.body;
    if (!post_id&&!viewer_id) {
      return res.status(400).json({ status: false, message: 'Please provide all the details' });
    } else {
      const postResult = await post.findOne({ _id: post_id });
      const user_id = postResult.user_id;
      const userDetails = await usermaster.findOne({ _id: user_id }, { _id: 0, name: 1, profile_img: 1, addprounous:1, private:1, connected:1 });
     
      if(userDetails.private===true){
        return res.status(400).json({ status: false, message: 'This Account is Private' });
      }else if(userDetails.connected===true){
        const inclu=await connection.findOne({user_id:user_id},{_id:0,connections:1})
       
        if (!inclu || !inclu.connections) {
          return res.status(400).json({ status: false, message: 'This Account is Set To Only Connections Of User' })
        }else{
          const connectionIds = inclu.connections.map(connection => connection._id.toString());
         
        if(connectionIds.includes(viewer_id)){
          const commentResult = await comments.find({ post_id: post_id });

          const commentIds = commentResult.map(comment => comment._id);
          const replyCommentResult = await replycomments.find({ comment_id: { $in: commentIds } });
    
          const commentsWithReplies = commentResult.map(comment => {
            const replies = replyCommentResult.filter(reply => String(reply.comment_id) === String(comment._id));
            return { ...comment.toObject(), replies }; });

            const likesOfPost = await likepost.findOne({ post_id: post_id });
      
            const result = { ...postResult.toObject(), userDetails, likes: likesOfPost, comments: commentsWithReplies };
          
            return res.status(200).json({ Status: true, message: 'Data fetched successfully', result });
        }else{
          return res.status(400).json({ status: false, message: 'This Account is Set To Only Connections Of User' })
        }
      }
    }
      else{
      const commentResult = await comments.find({ post_id: post_id });

      const commentIds = commentResult.map(comment => comment._id);
      const replyCommentResult = await replycomments.find({ comment_id: { $in: commentIds } });

      const commentsWithReplies = commentResult.map(comment => {
        const replies = replyCommentResult.filter(reply => String(reply.comment_id) === String(comment._id));
        return { ...comment.toObject(), replies };
      });

      const likesOfPost = await likepost.findOne({ post_id: post_id });

      const result = { ...postResult.toObject(), userDetails, likes: likesOfPost, comments: commentsWithReplies };
    
      return res.status(200).json({ Status: true, message: 'Data fetched successfully', result });
    }
  } 
}catch (err) {
 
    return res.status(400).json({ Status: 'Error', Error });
  }
};

exports.connectedppltotag=async(req,res)=>{
try{
const {_id}=req.body
const response=await connectSchema.findOne({user_id:_id},{_id:0,connections:1})
const connectionNames = response.connections.map(connection => connection);

if(connectionNames){
  return res.status(200).json({ Status: true, message:'list',connectionNames });
}
}catch (err) {
    
    return res.status(400).json({ Status: 'Error', Error });
  }
}
exports.deletePost=async(req,res)=>{
  try{
const {_id}=req.body
const response=await post.findOne({_id:_id})
if(response){
  await comments.deleteMany({post_id:_id})
  await replycomments.deleteMany({post_id:_id})
  await notification.deleteMany({post_id:_id})
  const response=await post.findOneAndDelete({_id:_id})
  return res.status(200).json({Status:true,message:'post Deleted successfully',response})
}else{
  return res.status(400).json({Status:false,message:'error fechting the post'})
}
}catch(err){

  return res.status(400).json({Status:'Error',Error})
}
}
// exports.getPostsOfAll=async(req,res)=>{
//   try{
//     const{user_id}=req.body
// const data=await usermaster.findOne({_id:user_id})
// const name=data.name

// const postss = await post.find(
//   { 'Tagged_people': data.name },
//   { _id: 0, user_id: 1 }
// );
// const userIds = postss.map(post => post.user_id);




// const user_ids=mongoose.Types.ObjectId(user_id)
// const seeinconnections=await connection.find({'connections._id':user_ids},{_id:0,user_id:1})
// const user_ids_array = seeinconnections.map(connection => connection.user_id);
// const users = await usermaster.find({ _id: { $in: user_ids_array },connected:true },{_id:1});

// const user_id_strings = users.map(user => user._id);

// const ids = user_id.toString();

// const blockedBy = await usermaster.find({'blockContact': ids}, {_id: 1});

// const blockedIds = blockedBy.map(user => user._id)



// const usersWithPostss= await usermaster.aggregate([
//   {
//     $match: {
//       private: { $ne: true },
//       connected: { $ne: true }, 
//       _id:{$nin:blockedIds}
//     }
//   },
//   {
//     $lookup: {
//       from: 'posts',
//       localField: '_id',
//       foreignField: 'user_id',
//       as: 'feed',
//     },
//   },
//   {
//     $project: {
//       _id: 1,
//       name:1,
//       addprounous:1,
//       profile_img:1,
//       'feed.Post_img': 1,
//       'feed.user_id': 1,
//       'feed.Post_discription':1,
//       'feed._id':1,
//       'feed.totallikesofpost':1,
//       'feed.totalcomments':1,
//       'feed.likedpeopledata':1,
//       'feed.Tagged_people':1,
//       'feed.createdAt': 1,
//     },
//   },
//   {
//     $sort: {
//       'feed.createdAt': -1, 
//     },
//   },
// ]);
// const usersWithPosts= await usermaster.aggregate([
//   {
//     $match: {
//      _id:{$in:user_id_strings},
//      _id:{$nin:blockedIds},
//      private: { $ne: true },
    
//     }
//   },
//   {
//     $lookup: {
//       from: 'posts',
//       localField: '_id',
//       foreignField: 'user_id',
//       as: 'feed',
//     },
//   },
//   {
//     $project: {
//       _id: 1,
//       name:1,
//       addprounous:1,
//       profile_img:1,
//       'feed.Post_img': 1,
//       'feed.user_id': 1,
//       'feed.Post_discription':1,
//       'feed._id':1,
//       'feed.totallikesofpost':1,
//       'feed.totalcomments':1,
//       'feed.likedpeopledata':1,
//       'feed.Tagged_people':1,
//       'feed.createdAt': 1,
//     },
//   },
//   {
//     $sort: {
//       'feed.createdAt': -1,
//     },
//   },
// ]);
// const usersWithPostsss= await usermaster.aggregate([
//   {
//     $match: {
//       $and: [
//         { _id: { $in: userIds } },
//         { _id: { $nin: blockedIds } }
//       ]
//     },
//   },

//   {
//     $lookup: {
//       from: 'posts',
//       localField: '_id',
//       foreignField: 'user_id',
//       as: 'feed',
//     },
//   },
//   {
//     $project: {
//       _id: 1,
//       name:1,
//       addprounous:1,
//       profile_img:1,
//       'feed.Post_img': 1,
//       'feed.Post_discription':1,
//       'feed._id':1,
//       'feed.user_id': 1,
//       'feed.totallikesofpost':1,
//       'feed.totalcomments':1,
//       'feed.likedpeopledata':1,
//       'feed.Tagged_people':1,
//       'feed.createdAt': 1,
//     },
//   },
//   {
//     $sort: {
//       'feed.createdAt': -1, 
//     },
//   },
// ]);

// const mergedUsersWithPosts = [
//   ...usersWithPosts,
//   ...usersWithPostss,
//   ...usersWithPostsss,
// ];

// const UsersWithPosts = Array.from(new Set(mergedUsersWithPosts.map(JSON.stringify))).map(JSON.parse);



// return res.status(200).json({ Status: true, message: 'Posts fetched successfully',UsersWithPosts})
// }catch(err){
   
//    return res.status(400).json({Status:'Error',Error})
// }
// }
exports.getAllPostsofMe = async (req, res) => {
  try {
    const { user_id } = req.body;

    const id = await usermaster.findOne({ _id: user_id });
    const results = await usermaster.aggregate([
      {
        $match: {
          _id: id._id,
        },
      },
      {
        $lookup: {
          from: 'posts',
          localField: '_id',
          foreignField: 'user_id',
          as: 'posts',
        },
      },
      {
        $unwind: '$posts',
      },
      {
        $sort: {
          'posts.createdAt': -1, // Sort in descending order based on createdAt field
        },
      },
      {
        $group: {
          _id: '$_id',
          name: { $first: '$name' },
          profile_img: { $first: '$profile_img' },
          addprounous: { $first: '$addprounous' },
          posts: { $push: '$posts' },
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          profile_img: 1,
          addprounous: 1,
          'posts.Post_img': 1,
          'posts.Post_discription': 1,
          'posts._id': 1,
          'posts.totallikesofpost': 1,
          'posts.totalcomments': 1,
          'posts.likedpeopledata': 1,
        }
      },
    ]);

    if (results) {
      return res.status(200).json({ Status: true, message: 'post fetched successfully', results });
    } else {
      return res.status(400).json({ Status: false, message: 'error fetching the file' });
    }
  } catch (err) {
    console.log(err)
    return res.status(400).json({ Status: 'Error', Error });
  }
};

exports.bockPost= async(req,res)=>{
  try{
const{post_id,blocker_id,blocking_reason}=req.body
if(!post_id&&!blocker_id&&!blocking_reason){
  return res.status(400).json({Status:false,message:'Please provide all the details'})
}else{
  const update=await post.findOneAndUpdate({_id:post_id},{$push:{post_blocked:blocker_id}})
  if(update){
    const data=await post.findOne({_id:post_id})
    const owner=data.user_id
  const blockpost=new blockepost({
    post_owner:owner,
    blocker_id:blocker_id,
    post_id:post_id,
    blocking_reason:blocking_reason
  })

  const response=await blockpost.save()
  if(response){
    return res.status(200).json({Status:true,message:'Post Blocked  successfully',response})
  }else{
    return res.status(400).json({Status:false,message:'some error while editing'})
  }
}else{
  return res.status(400).json({Status:false,message:'some error while editing'})
}
}
  }catch (err) {
    return res.status(400).json({ Status: 'Error', Error });
  }
}

// exports.getPostsOfAll = async (req, res) => {
//   try {
//     const { user_id } = req.body;
//     const data = await usermaster.findOne({ _id: user_id });
//     const name = data.name;

//     const postss = await post.find(
//       { 'Tagged_people': data.name },
//       { _id: 0, user_id: 1 }
//     )
//     const userIds = postss.map(post => post.user_id);

//     const user_ids = mongoose.Types.ObjectId(user_id);
//     const seeinconnections = await connection.find({ 'connections._id': user_ids }, { _id: 0, user_id: 1 });
//     const user_ids_array = seeinconnections.map(connection => connection.user_id);
//     const users = await usermaster.find({ _id: { $in: user_ids_array }, connected: true }, { _id: 1 });

//     const user_id_strings = users.map(user => user._id);
 

//     const ids = user_id.toString();

//     const blockedBy = await usermaster.find({ 'blockContact': ids }, { _id: 1 });

//     const blockedIds = blockedBy.map(user => user._id);

//     const usersWithPostss = await usermaster.aggregate([
//       {
//         $match: {
//           $and: [
//             { private: { $ne: true } },
//             { connected: { $ne: true } },
//             { _id: { $nin: data.blockContact } },
//           ],
//         },
//       },
//       {
//         $lookup: {
//           from: "posts",
//           let: { user_id: "$_id" },
//           pipeline: [
//             {
//               $match: {
//                 $expr: { $eq: ["$user_id", "$$user_id"] },
//               },
//             },
//             {
//               $sort: { createdAt: -1 },
//             },
//           ],
//           as: "feed",
//         },
//       },
//       {
//         $unwind: "$feed",
//       },
//       {
//         $project: {
//           _id: 1,
//           name: 1,
//           addprounous: 1,
//           profile_img: 1,
//           "feed.Post_img": 1,
//           "feed.Post_discription": 1,
//           "feed._id": 1,
//           "feed.user_id": 1,
//           "feed.totallikesofpost": 1,
//           "feed.totalcomments": 1,
//           "feed.likedpeopledata": 1,
//           "feed.Tagged_people": 1,
//           "feed.createdAt": 1,
//         },
//       },
//       {
//         $sort: {
//           "feed.createdAt": -1,
//         },
//       },
//     ]);

//     const usersWithPosts = await usermaster.aggregate([
//       {
//         $match: {
//           $and: [
//             { _id: { $in: user_id_strings } },
//             { _id: { $nin: blockedIds } }
//           ]
//         }
//       },
//       {
//         $lookup: {
//           from: 'posts',
//           localField: '_id',
//           foreignField: 'user_id',
//           as: 'feed',
//         },
//       },
//       {
//         $unwind: "$feed",
//       },
//       {
//         $project: {
//           _id: 1,
//           name: 1,
//           addprounous: 1,
//           profile_img: 1,
//           "feed.Post_img": 1,
//           "feed.Post_discription": 1,
//           "feed._id":          1,
//           "feed.user_id": 1,
//           "feed.totallikesofpost": 1,
//           "feed.totalcomments": 1,
//           "feed.likedpeopledata": 1,
//           "feed.Tagged_people": 1,
//           "feed.createdAt": 1,
//         },
//       },
//       {
//         $sort: {
//           "feed.createdAt": -1,
//         },
//       },
//     ]);

//     const usersWithPostsss = await usermaster.aggregate([
//       {
//         $match: {
//           $and: [
//             { _id: { $in: userIds } },
//             { _id: { $nin: blockedIds } }
//           ]
//         },
//       },
//       {
//         $lookup: {
//           from: "posts",
//           let: { user_id: "$_id" },
//           pipeline: [
//             {
//               $match: {
//                 $expr: {
//                   $and: [
//                     { $eq: ["$user_id", "$$user_id"] },
//                     { $in: [name, "$Tagged_people"] },
//                   ]
//                 },
//               },
//             },
//             {
//               $sort: { createdAt: -1 },
//             },
//           ],
//           as: "feed",
//         },
//       },
//       {
//         $unwind: "$feed",
//       },
//       {
//         $project: {
//           _id: 1,
//           name: 1,
//           addprounous: 1,
//           profile_img: 1,
//           "feed.Post_img": 1,
//           "feed.Post_discription": 1,
//           "feed._id": 1,
//           "feed.user_id": 1,
//           "feed.totallikesofpost": 1,
//           "feed.totalcomments": 1,
//           "feed.likedpeopledata": 1,
//           "feed.Tagged_people": 1,
//           "feed.createdAt": 1,
//         },
//       },
//       {
//         $sort: {
//           "feed.createdAt": -1,
//         },
//       },
//     ]);


//     const mergedUsersWithPosts = [
//       ...usersWithPosts,
//       ...usersWithPostss,
//       ...usersWithPostsss,
//     ];

//     const UsersWithPosts = Array.from(new Set(mergedUsersWithPosts.map(JSON.stringify))).map(JSON.parse);

//     return res.status(200).json({ Status: true, message: 'Posts fetched successfully', UsersWithPosts });
//   } catch (err) {
//     return res.status(400).json({ Status: 'Error', Error: err });
//   }
// };

exports.feedback=async(req,res)=>{
  try{
const {feedback,feedback_id}=req.body
if(!feedback&&!feedback_id){
  return res.status(400).json({Status:false,message:'Please provide all the details'})
}else{
  const data=new feedSchema({
    feedback:feedback,
    feedback_id:feedback_id
  })
  const response=await data.save()
if(response){
  return res.status(200).json({Status:true,message:'FeedBack Sent Successfully',response})
  }else{
    return res.status(400).json({Status:false,message:'some error while Sending'})
  }
}

  }catch (err) {
    
    return res.status(400).json({ Status: 'Error', Error });
  }
}


exports.getPostsOfAll = async (req, res) => {
  try {
    const { user_id } = req.body;
    const data = await usermaster.findOne({ _id: user_id });
    const name = data.name;

    const postss = await post.find(
      { 'Tagged_people': data.name },
      { _id: 0, user_id: 1 }
    )

    const postblock=await post.find(
      { 'post_blocked': user_id },
      { _id: 1,post_blocked:1}
    )
    const blockedPostIds = postblock.map(post => post._id);

    const userIds = postss.map(post => post.user_id);

    const user_ids = mongoose.Types.ObjectId(user_id);
    const seeinconnections = await connection.find({ 'connections._id': user_ids }, { _id: 0, user_id: 1 });
    //console.log(seeinconnections)
    const user_ids_array = seeinconnections.map(connection => connection.user_id);
    //console.log(user_ids_array)
    const users = await usermaster.find({ _id: { $in: user_ids_array }, connected: true }, { _id: 1 });
//console.log(users)
    const user_id_strings = users.map(user => user._id);
    console.log(user_id_strings)

    const ids = user_id.toString();

    const blockedBy = await usermaster.find({ 'blockContact': ids }, { _id: 1 });

    const blockedIds = blockedBy.map(user => user._id);

    const usersWithPostss = await usermaster.aggregate([
      {
        $match: {
          $and: [
            { private: { $ne: true } },
            { connected: { $ne: true } },
            { _id: { $nin: data.blockContact } },
            { _id: { $nin: blockedIds } }, // Exclude blocked users
          ],
        },
      },
      {
        $lookup: {
          from: "posts",
          let: { user_id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$user_id", "$$user_id"] },
                _id: { $nin: blockedPostIds } // Exclude posts blocked by users
              },
            },
            {
              $sort: { createdAt: -1 },
            },
          ],
          as: "feed",
        },
      },
      {
        $unwind: "$feed",
      },
      {
        $project: {
          _id: 1,
          name: 1,
          addprounous: 1,
          profile_img: 1,
          "feed.Post_img": 1,
          "feed.Post_discription": 1,
          "feed._id": 1,
          "feed.user_id": 1,
          "feed.totallikesofpost": 1,
          "feed.totalcomments": 1,
          "feed.likedpeopledata": 1,
          "feed.Tagged_people": 1,
          "feed.createdAt": 1,
        },
      },
      {
        $sort: {
          "feed.createdAt": -1,
        },
      },
    ]);
    

    const usersWithPosts = await usermaster.aggregate([
      {
        $match: {
          $and: [
          {_id: { $in: user_id_strings.map(id => mongoose.Types.ObjectId(id)) }},
          { _id: { $nin: blockedIds } },
          ]
        }
      
      },
      {
        $lookup: {
          from: "posts", // Update collection name if necessary
          let: { user_id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$user_id", "$$user_id"] },
                _id: { $nin: blockedPostIds }, // Exclude blocked posts
              },
            },
            {
              $sort: { createdAt: -1 },
            },
          ],
          as: "feed",
        },
      },
      {
        $unwind: "$feed",
      },
      {
        $project: {
          _id: 1,
          name: 1,
          addprounous: 1,
          profile_img: 1,
          "feed.Post_img": 1,
          "feed.Post_discription": 1,
          "feed._id": 1,
          "feed.user_id": 1,
          "feed.totallikesofpost": 1,
          "feed.totalcomments": 1,
          "feed.likedpeopledata": 1,
          "feed.Tagged_people": 1,
          "feed.createdAt": 1,
        },
      },
      {
        $sort: {
          "feed.createdAt": -1,
        },
      },
    ]);
    
    

    const usersWithPostsss = await usermaster.aggregate([
      {
        $match: {
          $and: [
            { _id: { $in: userIds } },
            { _id: { $nin: blockedIds } }
          ]
        },
      },
      {
        $lookup: {
          from: "posts",
          let: { user_id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$user_id", "$$user_id"] },
                    { $in: [name, "$Tagged_people"] },
                    { $not: { $in: ["$_id", blockedPostIds] } },
                  ]
                },
              },
            },
            {
              $sort: { createdAt: -1 },
            },
          ],
          as: "feed",
        },
      },
      {
        $unwind: "$feed",
      },
      {
        $project: {
          _id: 1,
          name: 1,
          addprounous: 1,
          profile_img: 1,
          "feed.Post_img": 1,
          "feed.Post_discription": 1,
          "feed._id": 1,
          "feed.user_id": 1,
          "feed.totallikesofpost": 1,
          "feed.totalcomments": 1,
          "feed.likedpeopledata": 1,
          "feed.Tagged_people": 1,
          "feed.createdAt": 1,
        },
      },
      {
        $sort: {
          "feed.createdAt": -1,
        },
      },
    ]);


    const mergedUsersWithPosts = [
      ...usersWithPosts,
      ...usersWithPostss,
      ...usersWithPostsss,
    ];

    const UsersWithPosts = Array.from(new Set(mergedUsersWithPosts.map(JSON.stringify))).map(JSON.parse);

    return res.status(200).json({ Status: true, message: 'Posts fetched successfully', UsersWithPosts });
  } catch (err) {
    
    return res.status(400).json({ Status: 'Error', Error: err });
  }
};




