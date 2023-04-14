const usermaster=require("../models/registration");
const Astro=require('../models/astrosign')
const Hobbies = require("../models/hobbies");
const post=require("../models/posts")

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

  

exports.getPostsOfAll=async(req,res)=>{
    try{
    const usersWithPosts = await usermaster.aggregate([
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
          'feed.Post_discription':1
          
        },
      },
    ]);
console.log(usersWithPosts)

      
      if(usersWithPosts){
    return res.status(200).json({Status:true,message:'post fetched successfully',usersWithPosts})
      }else{
        return res.status(400).json({Status:false,message:'error fechting the file'})
      }
}catch(err){
     console.log('err',err.message);
     return res.status(400).json({Status:'Error',Error})
  }
}