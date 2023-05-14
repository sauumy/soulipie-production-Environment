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
const mongoose=require('mongoose')
exports.createPost=async(req,res)=>{
    try{
        if(!req.body.user_id&&!req.files){
            return res.status(400).json({Status:false,message:'please select image'}) 
        }
else if(req.files && req.files.length > 0){
        user_id=req.body.user_id,
        Post_img=req.files.map(file => file.filename),
        Post_discription=req.body.Post_discription,
        Tagged_people=req.body.Tagged_people
        const posts = Post_img.map(p => new post({
          user_id,
          Post_discription,
          Tagged_people,
          Post_img: p
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
         console.log('err',err.message);
         return res.status(400).json({Status:'Error',Error})
      }
}

exports.getAllPostsofMe=async(req,res)=>{
    try{
         const{user_id}=req.body

        const id=await usermaster.findOne({_id:user_id})
       const results= await usermaster.aggregate([
        {
          $match: {
            _id: id._id
          }
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
          $project: {
            _id: 0,
            name:1,
            profile_img:1,
            occupation:1,
            'posts.Post_img': 1,
          'posts.Post_discription':1,
          'posts._id':1,
          'posts.totallikesofpost':1,
          'posts.totalcomments':1,
          'posts.likedpeopledata':1
            
          },
        },
      ]);

          
          if(results){
        return res.status(200).json({Status:true,message:'post fetched successfully',results})
          }else{
            return res.status(400).json({Status:false,message:'error fechting the file'})
          }
    }catch(err){
         console.log('err',err.message);
         return res.status(400).json({Status:'Error',Error})
      }
}


exports.deletePost=async(req,res)=>{
  try{
const {_id}=req.body
const response=await post.findOneAndDelete({_id:_id})
if(response){
  return res.status(200).json({Status:true,message:'post Deleted successfully',response})
}else{
  return res.status(400).json({Status:false,message:'error fechting the post'})
}
}catch(err){
  console.log('err',err.message);
  return res.status(400).json({Status:'Error',Error})
}
}

// exports.viewpost=async(req,res)=>{
//   try{
//  const{post_id}=req.body
//  if(!post_id){
//   return res.status(400).json({status:false,message:'Please provide all the details'})
//  }else{
//   // const respone=await post.findOne({_id:post_id})
//   // const comment = await comments.find({ post_id: post_id });
//   // const commentIds = comment.map(doc => doc._id);
//   // console.log(commentIds);
//   // const replycomment=await replycomments.find({comment_id:{$in:commentIds}})
//   // console.log(replycomment)
//   // const postResult = await post.findOne({ _id: post_id });
//   // const commentResult = await comments.find({ post_id: post_id });
//   // const likesofpost=await likepost.findOne({post_id:post_id})
//   // const commentIds = commentResult.map(comment => comment._id);
//   // const replyCommentResult = await replycomments.find({ comment_id: { $in: commentIds } });
//   // const commentsWithReplies = commentResult.map(comment => {
//   //   const replies = replyCommentResult.filter(reply => String(reply.comment_id) === String(comment._id));
//   //   return { ...comment.toObject(), replies };
//   // });
//   // const result = { ...postResult.toObject(), comments: commentsWithReplies };
//   // console.log(result);
//   const postResult = await post.findOne({ _id: post_id });
// const commentResult = await comments.find({ post_id: post_id });

// const commentIds = commentResult.map(comment => comment._id);
// const replyCommentResult = await replycomments.find({ comment_id: { $in: commentIds } });

// const commentsWithReplies = commentResult.map(comment => {
//   const replies = replyCommentResult.filter(reply => String(reply.comment_id) === String(comment._id));
//   return { ...comment.toObject(), replies };
// });

// const likesOfPost = await likepost.findOne({ post_id: post_id });

// const result = { ...postResult.toObject(), likes: likesOfPost, comments: commentsWithReplies };
// console.log(result);
//   res.json(result)

//   }
// }catch(err){
//     console.log('err',err.message);
//     return res.status(400).json({Status:'Error',Error})
//   }
// }

exports.editPost=async(req,res)=>{
  try{
    const{post_id,Post_discription,Tagged_people}=req.body
    if(!post_id){
      return res.status(400).json({status:false,message:'Please provide all the details'})
    }else{
      const respons=await post.findOneAndUpdate({_id:post_id},{$set:{Post_discription:Post_discription,Tagged_people:Tagged_people}})
      if(respons){
        const response=await post.findOne({_id:post_id})
        return res.status(200).json({Status:true,message:'Edited successfully',response})
      }else{
        return res.status(400).json({Status:false,message:'some error while editing'})
      }
    }
  }catch(err){
    console.log('err',err.message);
    return res.status(400).json({Status:'Error',Error})
  }
}
exports.reportPost=async(req,res)=>{
  try{
const{reporter_id,post_id,reportreason}=req.body
if(!reporter_id&&!post_id&&!reportreason){
  return res.status(400).json({Status:false,message:'Please provide all the details'})
}
else{
  const report=new reportpost({
    reporter_id:reporter_id,
    post_id:post_id,
    reportreason:reportreason
  })
  const response=await report.save()
  if(response){
    
    return res.status(200).json({Status:true,message:'Post reported  successfully',response})
  }else{
    return res.status(400).json({Status:false,message:'some error while editing'})
  }
}
  }catch(err){
    console.log('err',err.message);
    return res.status(400).json({Status:'Error',Error})
  }
}
// exports.viewpost=async(req,res)=>{
//   try{
//  const{post_id}=req.body
//  if(!post_id){
//   return res.status(400).json({status:false,message:'Please provide all the details'})
//  }else{
//   const postResult = await post.findOne({ _id: post_id });
// const user_id=postResult.user_id
// const userDetails=await usermaster.find({_id:user_id},{_id:0,name:1,profile_img:1})
// const commentResult = await comments.find({ post_id: post_id });

// const commentIds = commentResult.map(comment => comment._id);
// const replyCommentResult = await replycomments.find({ comment_id: { $in: commentIds } });

// const commentsWithReplies = commentResult.map(comment => {
//   const replies = replyCommentResult.filter(reply => String(reply.comment_id) === String(comment._id));
//   return { ...comment.toObject(), replies };
// });

// const likesOfPost = await likepost.findOne({ post_id: post_id });

// const result = { ...postResult.toObject(), likes: likesOfPost, comments: commentsWithReplies };
// console.log(result);
//   return res.status(200).json({Status:true,message:'Data fetched successfully',result})
// }
// }catch(err){
//     console.log('err',err.message);
//     return res.status(400).json({Status:'Error',Error})
//   }
// }


// exports.viewpost = async (req, res) => {
//   try {
//     const { post_id } = req.body;
//     if (!post_id) {
//       return res.status(400).json({ status: false, message: 'Please provide all the details' });
//     } else {
//       const postResult = await post.findOne({ _id: post_id });
//       const user_id = postResult.user_id;
//       const userDetails = await usermaster.findOne({ _id: user_id }, { _id: 0, name: 1, profile_img: 1 });
//       const commentResult = await comments.find({ post_id: post_id });

//       const commentIds = commentResult.map(comment => comment._id);
//       const replyCommentResult = await replycomments.find({ comment_id: { $in: commentIds } });

//       const commentsWithReplies = commentResult.map(comment => {
//         const replies = replyCommentResult.filter(reply => String(reply.comment_id) === String(comment._id));
//         return { ...comment.toObject(), replies };
//       });

//       const likesOfPost = await likepost.findOne({ post_id: post_id });

//       const result = { ...postResult.toObject(), likes: likesOfPost, comments: commentsWithReplies, userDetails };
//       console.log(result);
//       return res.status(200).json({ Status: true, message: 'Data fetched successfully', result });
//     }
//   } catch (err) {
//     console.log('err', err.message);
//     return res.status(400).json({ Status: 'Error', Error });
//   }
// };


exports.viewpost = async (req, res) => {
  try {
    const { post_id } = req.body;
    if (!post_id) {
      return res.status(400).json({ status: false, message: 'Please provide all the details' });
    } else {
      const postResult = await post.findOne({ _id: post_id });
      const user_id = postResult.user_id;
      const userDetails = await usermaster.findOne({ _id: user_id }, { _id: 0, name: 1, profile_img: 1 });
      const commentResult = await comments.find({ post_id: post_id });

      const commentIds = commentResult.map(comment => comment._id);
      const replyCommentResult = await replycomments.find({ comment_id: { $in: commentIds } });

      const commentsWithReplies = commentResult.map(comment => {
        const replies = replyCommentResult.filter(reply => String(reply.comment_id) === String(comment._id));
        return { ...comment.toObject(), replies };
      });

      const likesOfPost = await likepost.findOne({ post_id: post_id });

      const result = { ...postResult.toObject(), userDetails, likes: likesOfPost, comments: commentsWithReplies };
      console.log(result);
      return res.status(200).json({ Status: true, message: 'Data fetched successfully', result });
    }
  } catch (err) {
    console.log('err', err.message);
    return res.status(400).json({ Status: 'Error', Error });
  }
};

exports.connectedppltotag=async(req,res)=>{
try{
const {_id}=req.body
const response=await connectSchema.findOne({user_id:_id},{_id:0,connections:1})
const taggedlist=response.connections.name
if(taggedlist){
  return res.status(200).json({ Status: true, message:'list',taggedlist });
}
}catch (err) {
    console.log('err', err.message);
    return res.status(400).json({ Status: 'Error', Error });
  }
}

// exports.getPostsOfAll=async(req,res)=>{
//   try{
//     const{user_id}=req.body
// const data=await usermaster.findOne({_id:user_id})
// const name=data.name
// const postss = await post.find(
//   { 'Tagged_people': name },
//   { _id: 1 }
// );
// const connectedtrue=await usermaster.find({connected:true},{_id})
// const connectionsofconnectedtrue=await post.find({user:{$in:connectedtrue}}) 

// const usersWithPostss= await usermaster.aggregate([
//   {
//     $match: {
//       private: { $ne:true },
//       connected:{$ne:true}
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
//       occupation:1,
//       profile_img:1,
//       'feed.Post_img': 1,
//       'feed.Post_discription':1,
//       'feed._id':1,
//       'feed.totallikesofpost':1,
//       'feed.totalcomments':1,
//       'feed.likedpeopledata':1,
//       'feed.Tagged_people':1
//     },
//   },
// ]);
// return res.status(200).json({ Status: true, message: 'Posts fetched successfully',usersWithPostss})
// }catch(err){
//    console.log('err',err.message);
//    return res.status(400).json({Status:'Error',Error})
// }
// }

exports.getPostsOfAll=async(req,res)=>{
  try{
    const{user_id}=req.body
const data=await usermaster.findOne({_id:user_id})
const name=data.name
const postss = await post.find(
  { 'Tagged_people': name },
  { _id:0,user_id:1 }
);
//console.log(postss)
const userIds = postss.map(post => post.user_id);
console.log(userIds);


const user_ids=mongoose.Types.ObjectId(user_id)
const seeinconnections=await connection.find({'connections._id':user_ids},{_id:0,user_id:1})
//console.log(seeinconnections)
const user_ids_array = seeinconnections.map(connection => connection.user_id);
const users = await usermaster.find({ _id: { $in: user_ids_array },connected:true },{_id:1});
//console.log(users)
const user_id_strings = users.map(user => user._id);
//console.log(user_id_strings);

const blockedBy = await usermaster.find({'blockedContact': user_id})



const usersWithPostss= await usermaster.aggregate([
  {
    $match: {
      private: { $ne: true },
      connected: { $ne: true }, 
    }
  },
  {
    $lookup: {
      from: 'posts',
      localField: '_id',
      foreignField: 'user_id',
      as: 'feed',
    },
  },
  {
    $project: {
      _id: 1,
      name:1,
      occupation:1,
      profile_img:1,
      'feed.Post_img': 1,
      'feed.Post_discription':1,
      'feed._id':1,
      'feed.totallikesofpost':1,
      'feed.totalcomments':1,
      'feed.likedpeopledata':1,
      'feed.Tagged_people':1
    },
  },
]);
const usersWithPosts= await usermaster.aggregate([
  {
    $match: {
     _id:{$in:user_id_strings}
    }
  },
  {
    $lookup: {
      from: 'posts',
      localField: '_id',
      foreignField: 'user_id',
      as: 'feed',
    },
  },
  {
    $project: {
      _id: 1,
      name:1,
      occupation:1,
      profile_img:1,
      'feed.Post_img': 1,
      'feed.Post_discription':1,
      'feed._id':1,
      'feed.totallikesofpost':1,
      'feed.totalcomments':1,
      'feed.likedpeopledata':1,
      'feed.Tagged_people':1
    },
  },
]);
const usersWithPostsss= await usermaster.aggregate([
  {
    $match: {
     _id:{$in:userIds}
    }
  },
  {
    $lookup: {
      from: 'posts',
      localField: '_id',
      foreignField: 'user_id',
      as: 'feed',
    },
  },
  {
    $project: {
      _id: 1,
      name:1,
      occupation:1,
      profile_img:1,
      'feed.Post_img': 1,
      'feed.Post_discription':1,
      'feed._id':1,
      'feed.totallikesofpost':1,
      'feed.totalcomments':1,
      'feed.likedpeopledata':1,
      'feed.Tagged_people':1
    },
  },
]);

const mergedUsersWithPosts = [
  ...usersWithPosts,
  ...usersWithPostss,
  ...usersWithPostsss,
];

const UsersWithPosts = Array.from(new Set(mergedUsersWithPosts.map(JSON.stringify))).map(JSON.parse);



return res.status(200).json({ Status: true, message: 'Posts fetched successfully',UsersWithPosts})
}catch(err){
   console.log('err',err.message);
   return res.status(400).json({Status:'Error',Error})
}
}






















