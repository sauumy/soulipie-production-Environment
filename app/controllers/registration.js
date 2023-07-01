const Users = require('../models/registration');
const chaservice = require('../services/chapter-service')
const otpService = require('../services/otp_service')
const jwtTokenService = require('../services/jwt-service')
const service = require('../services/mobile_service');
const {callerID}=require('../models/roomid')
const {v4 : uuidv4} = require('uuid')
const connection=require('../models/requests')
const notifications=require('../models/notification')
const users=require('../models/connection')
const admin = require('firebase-admin');
const serviceAccount = require('../../soulipie-6f717-firebase-adminsdk-eys0f-9762589deb.json')
const post=require("../models/posts")
const likespost=require('../models/likespost')
const comment=require('../models/comments');
const replycomment=require('../models/replycomment')
const storeMsg=require('../models/storemssage')
const {chatModule}=require('../models/chatmodule')
const mongoose=require('mongoose');
const notification = require('../models/notification');
const {isRoom}=require('../models/chatroom')
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://soulipie-6f717-default-rtdb.firebaseio.com"
});
  const messaging = admin.messaging();
  const fetch = require('node-fetch');
  
// exports.deeplink = async (req, res) => {
//     try {
//       const link = req.body.link; 
//       const _id = req.body._id; 
//       const androidPackageName = 'com.soulipie_app'; 
//       const apikey = 'AIzaSyBhlTa0Yj8wM-Fk4Z5SjJtRvAE_E-nHJzI'; 
//       const url = `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${apikey}`;
      
//       const response = await fetch(url, {method: 'POST', headers: {'Content-Type': 'application/json'},

//   body: JSON.stringify({dynamicLinkInfo: {domainUriPrefix: 'https://soulipieapp.page.link',link: link,
//   androidInfo: {androidPackageName: androidPackageName,androidFallbackLink: 'https://play.google.com/store/apps/details?id=com.hiddenlyy'
//             },
//   socialMetaTagInfo: {socialTitle: 'Check out this link!',socialDescription: 'This is the description of the link',},
//           },
//           suffix: {
//             option: 'SHORT',
//           },
//         }),
//       });
//      const data = await response.json();
   
      
//       res.json({Status:true,message:"deep link created",shortLink: data.shortLink,_id: _id,});
//     } catch (error) {
//       res.status(500).json({message: 'An error occurred while generating the Dynamic Link.',
//       });
//     }
// }  
exports.deeplink = async (req, res) => {
  try {
    const link = req.body.link; 
    const _id = req.body._id; 
    const androidPackageName = 'com.soulipie'; 
    const apikey = 'AIzaSyA2zYw9EGDsalo6oKRHHkrbndGZ5SZFUz8'; 
    const url = `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${apikey}`;
    
    const response = await fetch(url, {method: 'POST', headers: {'Content-Type': 'application/json'},

body: JSON.stringify({dynamicLinkInfo: {domainUriPrefix: 'https://soulipie.page.link',link: link,
androidInfo: {androidPackageName: androidPackageName,androidFallbackLink: 'https://play.google.com/store/apps/details?id=com.soulipie_app'
          },
socialMetaTagInfo: {socialTitle: 'Check out this link!',socialDescription: 'This is the description of the link',},
        },
        suffix: {
          option: 'SHORT',
        },
      }),
    });
   const data = await response.json();
 
    
    res.json({Status:true,message:"deep link created",shortLink: data.shortLink,_id: _id,});
  } catch (error) {
    res.status(500).json({message: 'An error occurred while generating the Dynamic Link.',
    });
  }
} 

exports.healthcheck = async (req, res) => {
    const healthcheck = {
        uptime: process.uptime(),
        message: 'OK',
        timestamp: Date.now()
    };
    try {
        res.send(healthcheck);
    } catch (error) {
        healthcheck.message = error;
        res.status(503).send();
    }
}
exports.callID=async(req,res)=>{
    try{
const {host_id,joiner_id,callerId}=req.body

if(!host_id|| !joiner_id){
    res.send({ErrorMessage:"Please Before Provide user_id and other_id"})
   }
else{

if(host_id.length>10){
     let l = host_id.length 
     if(l===12){
        host_id = host_id.substring(2)
     }
     else if(l===13){
        host_id = host_id.substring(3)
     }
  }
  if(joiner_id.length>10){
      let l = joiner_id.length 
      if(l===12){
        joiner_id = joiner_id.substring(2)
      }
      else if(l===13){
        joiner_id = joiner_id.substring(3)
      }
  }

  var response=await callerID.find({
        $or:[{host_id:host_id,joiner_id:joiner_id},{host_id:joiner_id,joiner_id:host_id}]
  });
  if(response.length!=0){

      res.status(200).send({status:"Success",message:"room created",response})
  }

  else{
     const callerId=uuidv4()
     const user=new callerID({
        host_id:host_id,
        joiner_id:joiner_id,
      callerId:callerId.toString()
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
}
}
    catch(err){
      
        return res.status(400).send({Status:'Error',message:'somthing went wrong'})
       }                    
 
}
exports.otpVerify = async (req, res) => {

try{
    const {mobilenumber} = req.body
     if(mobilenumber){
        const response=await Users.findOne({mobilenumber:mobilenumber})
        const otp=response.otp
        if(otp==='false'&&response.profile==='false'){
          const result=await Users.findOneAndUpdate({mobilenumber:mobilenumber},{$set:{otp:'true'}},{new:true})
        if(result){
          const response=await Users.findOne({mobilenumber:mobilenumber})
          return res.status(200).send({Status:true,message:'otp Verified Successfully',response})
        }else{
          return res.status(400).send({Status:false,message:'somthing went wrong'})
        }
        
        }else{
                    const response=await Users.findOne({mobilenumber:mobilenumber})
                    return res.status(400).send({Status:'false',message:'otp verified already',response})
        }
}else{
  return res.status(400).send({Status:'false',message:'please provide mobilenumber'})
}
}catch(err){
   
    return res.status(400).send({Status:'false',message:'somthing went wrong'})
           }
}
exports.registration = async (req, res) => {
  try{ 
   const {mobilenumber,token}=req.body
   if(!mobilenumber){
    return res.status(400).send({Status:false,message:'Please provide Mobile number'})
   }else{
    const istherearenot=await Users.findOne({mobilenumber:mobilenumber})
    
  if(istherearenot){
    const otp=istherearenot.otp
    const profile=istherearenot.profile
    const response=istherearenot
    if(otp==='true'&&profile==='true'){
      return res.status(400).send({Status:false,message:'You have already registerd with the Soulipie'})
    }else if (otp==='true'&&profile==='false'){
      return res.status(400).send({Status:false,message:'OTP verified',response})
    }else if(otp==='false'&&profile==='false'){
      return res.status(200).send({Status:true,message:'Otp sent on mobile Successfully'})
    }
   }else{
    const user=new Users({
      mobilenumber:mobilenumber,
      token:token
    })
    await user.save()
    if(user){
      return res.status(200).send({Status:true,message:'otp Sent Successfully to Your Mobilenumber'})
    }else{
      return res.status(400).send({Status:false,message:'something error'})
    }
}
  }
} 
catch(err){
       
      return res.status(400).send({Status:'Error',message:'somthing went wrong'})
     }                    
}  
exports.sendRequest=async (req, res) => {
    
      try {
          const { fromUser, toUser } = req.body;
          const filter = {
            $and: [
              {
                fromUser:fromUser,
         toUser:toUser

              },
              {
                requestPending: true
              }
            ]
          };
          const requestExists = await connection.findOne(filter);
        if (requestExists) {
          return res.status(400).json({ status:false,message: 'Connection request already sent.' });
        }
    else{
        const follower = new connection({
          fromUser:fromUser,
          toUser:toUser,
          requestPending: true
        });
        const response=await follower.save();
          if(follower){
        const sender = await Users.findOne({ _id: fromUser },{_id:1,profile_img:1,token:1,name:1});
        const profile_img=sender.profile_img
        const name=sender.name
     
        const data=await Users.findOne({_id:toUser},{_id:0,token:1})
        const token=data.token
      
      const touser=await users.findOne({user_id:toUser})
      if(touser){
        const update=await users.findOneAndUpdate({user_id:toUser},{$push:{totalrequest:sender}})
        
        if(update){
          const notification = {
              title: 'Soulipie',
              body: `${name} would like to connect with you`,
              icon:profile_img
            };
            const data={
              page_name:'Notification'
            }
            if(notification){
              const noti=new notifications({
                user_id:toUser,
                requested_id:fromUser,
                request:notification
              })
              await noti.save()
            }
          await admin.messaging().sendToDevice(token,{notification,data});
          return res.status(200).json({status:true, message: 'Connection request sent successfully',response,notification});
        }
      }
      else{
        const user=new users({
          user_id:toUser,
          totalrequest:sender
        })
        const requestsent=await user.save()
      
          if(requestsent){
        const notification = {
            title: 'Soulipie',
            body: `${name} would like to connect with you`,
            icon:profile_img
          }
          const data={
            page_name:'Notification'
          }
        
          if(notification){
            
            const noti=new notifications({
              user_id:toUser,
              requested_id:fromUser,
              request:notification
            })
            await noti.save()
          }
        await admin.messaging().sendToDevice(token,{notification,data});
        return res.status(200).json({status:true, message: 'Connection request sent successfully',response,notification});
      }
    }
    } 
  }
  }catch (error) {
       
        return res.status(500).json({ status:false,message: 'Internal server error.' });
      }
}
  exports.requestCount=async(req, res)=>{
  try {
  const {_id}=req.params
   const request=await users.findOne({user_id:_id},{totalrequest:1,_id:0})
   if (request && request.totalrequest !== null) {
    const requests = request.totalrequest;
    const requestCount = requests.length;
  return res.status(200).json({status:true, message: 'requests fetch successfully.',requestCount });
  }else{
      return res.status(400).json({ status:false,message: 'Counldnt sind any request' });
  }
  
  }catch (error) {
             
              return res.status(500).json({status:false, message: 'Internal server error.' });
      }
}
  exports.getRequest = async (req, res) => {
    try {
      const { _id } = req.params;
      const request = await users
        .findOne({ user_id: _id }, { totalrequest: 1, _id: 0 });
      let requests = request?.totalrequest;
      if (requests) {
        requests.sort((a, b) => a.createdAt - b.createdAt); // Sort requests based on timing
        requests.reverse(); // Reverse the order of the array
        return res.status(200).json({ status: true, message: 'Requests fetched successfully.', requests });
      } else {
        return res.status(400).json({ status: false, message: 'Could not find any request' });
      }
    } catch (error) {
      return res.status(500).json({ status: false, message: 'Internal server error.' });
    }
}  
exports.getNotification=async(req,res)=>{
  try{
    const {_id}=req.params
    const response =await notifications.find({user_id:_id}).sort({ createdAt: -1 });
    if(response){
      return res.status(200).json({status:true ,message: `get notification successfully`,response});
    }else{
      return res.status(400).json({ status:false,message: 'Coulnt load notification' });
    }
  }catch (error) {
        
        return res.status(500).json({status:false, message: 'Internal server error.' });
      }
}
exports.getLikesOfPost=async(req,res)=>{
    try{
  const{post_id}=req.body
  const response=await likespost.findOne({post_id:post_id},{_id:0,likesofposts:1})
  if(response){
    return res.status(200).json({Status:true,message:'likes fetched Successfuly',response})
  }else{
    return res.status(400).json({Status:false,message:'couldnot find the post'})
  }
    }catch(err){
   
    return res.status(400).json({Status:'Error',Error})
  }
}
exports.getComment=async(req,res)=>{
  try{
const {post_id}=req.body
if (!post_id) {
  return res.status(400).json({ Status: false, message: 'Please provide all the details' });
}else{
  const respons=await comment.find({post_id:post_id})
  const responses=await replycomment.find({post_id:post_id})
  const response=respons.concat(responses)
  if(response){
    return res.status(200).json({ Status: true, message: 'All the Comments of Post',response });
  }else{
    return res.status(400).json({ Status: false, message: 'Couldnot find Any Comment For The Post' });
  }
}
}catch(err){
   
    return res.status(400).json({Status:'Error',Error})
  }
}
exports.likePost = async(req, res) => {
  try {
    const { post_id, liker_id } = req.body;
    if (!post_id || !liker_id) {
      return res.status(400).json({ Status: false, message: 'Please provide all the details' });
    } else {
      const liker = await Users.findOne({_id: liker_id }, { _id:1, name: 1, profile_img: 1, token: 1 });
      const name=liker.name
      const profile_img=liker.profile_img
      const data=await post.findOne({_id:post_id},{_id:0,user_id:1})
      const data1=data.user_id
      
      const user_id=await Users.findOne({_id:data1},{_id:0,token:1})
      const token=user_id.token
      const likesPost = await likespost.findOne({ post_id: post_id });
    
      if (likesPost) {
        const likesOfPosts = likesPost.likesofposts;
        
        if (likesOfPosts.length>0&&likesOfPosts.some((obj) => obj._id.toString() === liker_id)) {
          const response=await likespost.updateOne({ post_id: post_id }, { $pull: { likesofposts: liker } });
         
          if(response){
            const count=await likespost.findOne({post_id:post_id})
            const likes=count?count.likesofposts.length : 0
          
            const totallikes=await likespost.findOneAndUpdate({post_id:post_id},{$set:{totallikesofpost:likes}})
            await post.findOneAndUpdate({_id:post_id},{$set:{totallikesofpost:likes}})
            await post.updateOne({_id:post_id},{ $pull:{likedpeopledata:liker}})
            if(totallikes){
              const notification = {
                title: 'Soulipie',
                body: `${name} Liked your Post`,
                icon:profile_img
              };
              
              if(notification){
                await notifications.findOneAndDelete({post_id:post_id,likespost:notification})
                const result=await likespost.findOne({post_id:post_id})
              return res.status(200).json({ Status: true, message: 'Liker removed from likesofposts',result });
              }else{
                return res.status(400).json({ Status: false, message: 'Eoror Coudnot find Notification' });
              }
            }else{
              return res.status(400).json({ Status: false, message: 'Eoror while Liker removed from likesofposts' });
            }
          }else{
            return res.status(400).json({ Status: false, message: 'Eoror while Liker removed from likesofposts' });
          }
        } else {
          const response=await likespost.updateOne({ post_id: post_id }, { $push: { likesofposts: liker } });
         
          if(response){
            const count=await likespost.findOne({post_id:post_id})
        const likes=count?count.likesofposts.length : 0
       
        const totallikes=await likespost.findOneAndUpdate({post_id:post_id},{$set:{totallikesofpost:likes}})
        const total=await post.updateOne({_id:post_id},{$set:{totallikesofpost:likes}})
        await post.updateOne({_id:post_id},{ $push:{likedpeopledata:liker}})
        if(totallikes&&total){
            const notification = {
                                      title: 'Soulipie',
                                      body: `${name} Liked your Post`,
                                      icon:profile_img
                                    };
                                    const data={
                                      page_name:'Notification'
                                    }
                                                          if(notification){
                                                            const noti=new notifications({
                                                              post_id:post_id,
                                                              user_id:data1,
                                                              likespost:notification,
                                                              post_liker_id:liker_id
                                                            })
                                                            await noti.save()
                                                          }
                                                        await admin.messaging().sendToDevice(token,{notification,data});
                                              return res.status(200).json({Status:true,message:'liked your post',notification})
          }else{
            return res.status(200).json({ Status: true, message: 'coudnt Liker added to likesofposts' });
          }
        }else{
            return res.status(400).json({ Status: false, message: 'Eoror while Liker adding to likesofposts' });
          }
        }
      } else {
        const data = new likespost({
          post_id: post_id,
          user_id:data1,
          likesofposts: liker
        });
        const response=await data.save();
  
        if(response){
          const count=await likespost.findOne({post_id:post_id})
          const likes=count?count.likesofposts.length : 0
         
          const totallikes=await likespost.findOneAndUpdate({post_id:post_id},{$set:{totallikesofpost:likes}})
          const total=await post.updateOne({_id:post_id},{$set:{totallikesofpost:likes}})
          await post.updateOne({_id:post_id},{ $push:{likedpeopledata:liker}})
          if(totallikes&&total){
            const notification = {
              title: 'Soulipie',
              body: `${name} Liked your Post`,
              icon:profile_img
            };
            const data={
              page_name:'Notification'
            }
            if(notification){
              const noti=new notifications({
                post_id:post_id,
                user_id:data1,
                likespost:notification,
                post_liker_id:liker_id

              })
              await noti.save()
            }
          await admin.messaging().sendToDevice(token,{notification,data});
return res.status(200).json({Status:true,message:'liked your post',notification})
          }else{
            return res.status(400).json({ Status: false, message: 'Eoror while Liker adding to likesofposts' });
          }
      }else{
        return res.status(400).json({ Status: false, message: 'Eoror while Liker adding to likesofposts' });
      }

    }
    }
  } catch (err) {
   
    return res.status(400).json({ Status: 'Error', Error });
  }
}
exports.addComment=async(req,res)=>{
  try{
const {post_id,commenter_id,text}=req.body
if (!post_id || !commenter_id) {
  return res.status(400).json({ Status: false, message: 'Please provide all the details' });
}else{
  const commenter = await Users.findOne({ _id: commenter_id }, { _id: 1, name: 1, profile_img: 1, token: 1 });
  const name=commenter.name
  const profile_img=commenter.profile_img
  const data=await post.findOne({_id:post_id},{_id:0,user_id:1})
  const user_id=data.user_id
  const data1=await Users.findOne({_id:user_id},{_id:0,token:1})
  const token=data1.token
    if(commenter){
    const data=new comment({
      post_id:post_id,
      commentdetails:commenter,
      text:text
    })
    const response=await data.save()
    const comment_id = response._id
  
    if(response){
      const notification = {
        title: 'Soulipie',
        body: `${name} Commented On your Post`,
        icon:profile_img
      };
      const data={
        page_name:'Notification'
      }
      
      if(notification){
        const noti=new notifications({
          post_id:post_id,
          user_id:user_id,
          comment_id:comment_id,
          post_commenter_id:commenter_id,
          comment:notification
        })
        await noti.save()
      }
    await admin.messaging().sendToDevice(token,{notification,data});
    
    const count =Number(await comment.find({ post_id: post_id }).countDocuments());
    const counts=Number(await replycomment.find({post_id:post_id}).countDocuments())
    
    const total=count+counts
    await post.findOneAndUpdate({_id:post_id},{$set:{totalcomments:total}})
return res.status(200).json({Status:true,message:'Commented On Your POst',response,notification})

    }else{
 return res.status(400).json({ Status: false, message: 'Eoror while Commenting the Data' });
    }

  }else{
    return res.status(400).json({ Status: false, message: 'nno post found' });
  }
}

}catch(err){
  
    return res.status(400).json({Status:'Error',Error})
}
}
exports.addReplyComment=async(req,res)=>{
  try{
const {post_id,comment_id,commenter_id,text}=req.body
if (!post_id || !commenter_id||!comment_id||!text) {
  return res.status(400).json({ Status: false, message: 'Please provide all the details' });
}else{
  const commenter = await Users.findOne({ _id: commenter_id }, { _id: 1, name: 1, profile_img: 1, token: 1 });
  const name=commenter.name
  const profile_img=commenter.profile_img
  const data=await comment.findOne({post_id:post_id,comment_id:comment_id},{_id:0,commentdetails:1})
  const user_id=data.commentdetails._id
  const data1=await Users.findOne({_id:user_id},{_id:0,token:1})
  const token=data1.token
  const posting=await post.findOne({_id:post_id},{_id:0,user_id:1})
  const poster=posting.user_id
  const postd=await Users.findOne({_id:poster},{_id:0,token:1})
  const postertoken=postd.token
    if(commenter){
    const data=new replycomment({
      post_id:post_id,
      comment_id:comment_id,
      commentdetails:commenter,
      text:text
    })
    const response=await data.save()
    const replycomment_id=response._id
    if(response){
      const notification1 = {
        title: 'Soulipie',
        body: `${name} Commented On your Post`,
        icon:profile_img
      };
      const data1={
        page_name:'Notification'
      }
      const notification2= {
        title: 'Soulipie',
        body: `${name} Mentioned You On Comment`,
        icon:profile_img
      };
      const data2={
        page_name:'Notification'
      }
      if(notification1&&data1){
        const noti=new notifications({
          post_id:post_id,
          comment_id:comment_id,
          user_id:poster,
          replycomment_id:replycomment_id,
          replyCommenter_id:commenter_id,
          replyComment:notification1
        })
        await noti.save()
        const notis=new notifications({
          post_id:post_id,
          comment_id:comment_id,
          user_id:user_id,
          replycomment_id:replycomment_id,
          mentioner_id:commenter_id,
          mentioned:notification2
        })
        await notis.save()
      }
    await admin.messaging().sendToDevice(postertoken,{notification:notification1,data:data1});
    await admin.messaging().sendToDevice(token,{notification:notification2,data:data2});
    const count =Number(await comment.find({ post_id: post_id }).countDocuments());
    const counts=Number(await replycomment.find({post_id:post_id}).countDocuments())
   
    const total=count+counts
    await post.findOneAndUpdate({_id:post_id},{$set:{totalcomments:total}})
return res.status(200).json({Status:true,message:'Commented On Your POst',response,notification1,data1,notification2,data2})

    }else{
 return res.status(400).json({ Status: false, message: 'Eoror while Commenting the Data' });
    }

  }else{
    return res.status(400).json({ Status: false, message: 'nno post found' });
  }
}
}catch(err){
    
    return res.status(400).json({Status:'Error',Error})
}
}
exports.likeComment=async(req,res)=>{
  try{
const {post_id,comment_id,liker_id}=req.body
if (!post_id || !comment_id||!liker_id) {
  return res.status(400).json({ Status: false, message: 'Please provide all the details' });
}else{
const response= await comment.findOne({post_id:post_id,_id:comment_id})
const liker = await Users.findOne({ _id: liker_id }, { _id: 1, name: 1, profile_img: 1, token: 1 });
  const name=liker.name
  const profile_img=liker.profile_img
  const data=await comment.findOne({post_id:post_id , comment_id:comment_id},{_id:0,commentdetails:1})
 
  const user_id = data.commentdetails._id
  const token = data.commentdetails.token
 
if(response){
  const commentlikerDetails = response.commentlikerDetails;
       
  if (commentlikerDetails.some((obj) => obj._id.toString() === liker_id)) {
  const response=await comment.updateOne({post_id:post_id,_id:comment_id},{$pull:{commentlikerDetails:liker}})
  if(response){
    const count=await comment.findOne({post_id:post_id,_id:comment_id})
    const likes=count?count.commentlikerDetails.length : 0
    
    const totallikes=await comment.findOneAndUpdate({post_id:post_id,_id:comment_id},{$set:{totallikesofcomments:likes}})
    if(totallikes){
      const notification = {
        title: 'Soulipie',
        body: `${name} Liked your Comment`,
        icon:profile_img
      };
      if(notification){
        await notifications.findOneAndDelete({post_id:post_id,comment_id:comment_id,likecomment:notification})
        const result=await comment.findOne({post_id:post_id,_id:comment_id})
      return res.status(200).json({ Status: true, message: 'Liker removed from Your Comment',result });
      }else{
        return res.status(400).json({ Status: false, message: 'Eoror Coudnot find Notification' });
      }
    }else{
      return res.status(400).json({ Status: false, message: 'Eoror while Liker removed from Comments' });
    }
  }else{
    return res.status(400).json({ Status: false, message: 'Coudnot Like The Comment' });
  }
}else{
  const response=await comment.updateOne({ post_id: post_id,_id:comment_id }, { $push: { commentlikerDetails:liker} });
 
  if(response){
    const count=await comment.findOne({post_id:post_id,_id:comment_id})
const likes=count?count.commentlikerDetails.length : 0

const totallikes=await comment.findOneAndUpdate({post_id:post_id,_id:comment_id},{$set:{totallikesofcomments:likes}})
if(totallikes){
    const notification = {
                              title: 'Soulipie',
                              body: `${name} Liked your Comment`,
                              icon:profile_img
                            };
                            const data={
                              page_name:'Notification'
                            }
                                                  if(notification){
                                                    
                                                    const noti=new notifications({
                                                      post_id:post_id,
                                                      user_id:user_id,
                                                      comment_id:comment_id,
                                                      likecomment:notification,
                                                      commente_liker_id:liker_id
                                                    })
                                                    await noti.save()
                                                  }
                                                await admin.messaging().sendToDevice(token,{notification,data});
                                      return res.status(200).json({Status:true,message:'liked your Comment',notification})
  }else{
    return res.status(400).json({ Status: false, message: 'coudnt Liker added to comment' });
  }
}else{
    return res.status(400).json({ Status: false, message: 'Eoror while Liker adding to comment' });
  }
}
}
 } 
}catch(err){
    
    return res.status(400).json({Status:'Error',Error})
  }
}
exports.replyCommentlike=async(req,res)=>{
  try{
const {post_id,comment_id,replycomment_id,liker_id}=req.body
if (!post_id || !comment_id||!liker_id||!replycomment_id) {
  return res.status(400).json({ Status: false, message: 'Please provide all the details' });
}else{
const response= await replycomment.findOne({_id:replycomment_id})
const liker = await Users.findOne({ _id: liker_id }, { _id: 1, name: 1, profile_img: 1, token: 1 });
  const name=liker.name
  const profile_img=liker.profile_img
  const data=await replycomment.findOne({_id:replycomment_id},{_id:0,commentdetails:1})
  
  const token=data.commentdetails.token

  const user_id=data.commentdetails._id
 
if(response){
  const commentlikerDetails = response.commentlikerDetails;
       
  if (commentlikerDetails.some((obj) => obj._id.toString() === liker_id)) {
  const response=await replycomment.updateOne({_id:replycomment_id},{$pull:{commentlikerDetails:liker}})
  if(response){
    const count=await replycomment.findOne({_id:replycomment_id})
    const likes=count?count.commentlikerDetails.length : 0
   
    const totallikes=await replycomment.findOneAndUpdate({_id:replycomment_id},{$set:{totallikesofcomments:likes}})
    if(totallikes){
      const notification = {
        title: 'Soulipie',
        body: `${name} Liked your Comment`,
        icon:profile_img
      };
     
      
      if(notification){
        await notifications.findOneAndDelete({ post_id:post_id,comment_id:comment_id,replycomment_id:replycomment_id,replyCommentlike:notification}) 
        const result=await replycomment.findOne({_id:replycomment_id})
      return res.status(200).json({ Status: true, message: 'Liker removed from Your Comment',result });
      }else{
        return res.status(400).json({ Status: false, message: 'Eoror Coudnot find Notification' });
      }
    }else{
      return res.status(400).json({ Status: false, message: 'Eoror while Liker removed from Comments' });
    }
  }else{
    return res.status(400).json({ Status: false, message: 'Coudnot Like The Comment' });
  }
}else{
  const response=await replycomment.updateOne({_id:replycomment_id}, { $push: { commentlikerDetails:liker} });
  
  if(response){
    const count=await replycomment.findOne({_id:replycomment_id})
const likes=count?count.commentlikerDetails.length : 0

const totallikes=await replycomment.findOneAndUpdate({_id:replycomment_id},{$set:{totallikesofcomments:likes}})
if(totallikes){
    const notification = {
                              title: 'Soulipie',
                              body: `${name} Liked your Comment`,
                              icon:profile_img
                            };
                            const data={
                              page_name:'Notification'
                            }
                                                  if(notification){
                                                    const noti=new notifications({
                                                      post_id:post_id,
                                                      comment_id:comment_id,
                                                      user_id:user_id,
                                                      replycomment_id:replycomment_id,
                                                      replyCommentlike :notification,
                                                      replyCommente_liker_id:liker_id
                                                    })
                                                    await noti.save()
                                                  }
                                                await admin.messaging().sendToDevice(token,{notification,data});
                                      return res.status(200).json({Status:true,message:'liked your Comment',notification})
  }else{
    return res.status(400).json({ Status: false, message: 'coudnt Liker added to comment' });
  }
}else{
    return res.status(400).json({ Status: false, message: 'Eoror while Liker adding to comment' });
  }
}
}
 } 
}catch(err){
   
    return res.status(400).json({Status:'Error',Error})
  }
}
exports.acceptRequest=async (req, res) => {
  try {
   
   const { fromUser, toUser } = req.body;
   const filter = {
     $and: [
       {
         fromUser:fromUser,
  toUser:toUser

       },
       {
         requestPending: true
       }
     ]
   };
   const requestExists = await connection.findOne(filter);
   if (!requestExists) {
     return res.status(400).json({status:false, message: 'Connection request does not exist.' });
   }
else{
  
   const update = { $set: { requestPending: false } };
   const accept = await connection.updateOne(filter,update);
   
   if(accept){
   const receiver=await Users.findOne({_id:toUser})
   const name=receiver.name
   const profile_img=receiver.profile_img
   const sender = await Users.findOne({ _id: fromUser },{_id:1,profile_img:1,token:1,name:1});
   const token = sender.token;
   const image=sender.profile_img
   const names=sender.name
   if(sender){
   const totalrequest=await users.updateOne({user_id:toUser},{$pull:{totalrequest:sender}})

   if(totalrequest){
     const connection=await users.updateOne({user_id:toUser},{$push:{connections:sender}})
     if(connection){
      const deleterequest= {
        title: 'Soulipie',
        body: `${names} would like to connect with you`,
        icon:image
      }
    
      await notifications.findOneAndDelete({user_id:toUser,request:deleterequest})
         const notification = {
             title: 'Soulipie',
             body: `${name} accepted your connection request`,
             icon:profile_img
           };
           const data={
             page_name:'Notification'
           }
           if(notification){
             const noti=new notifications({
               user_id:fromUser,
               accpeted_id:toUser,
               accpeted:notification
             })
             await noti.save()
           }
          
         await admin.messaging().sendToDevice(token,{notification,data});
         
   return res.status(200).json({status:true, message: `Connection request accepted successfully.`,notification});
 } else{
   return res.status(400).json({ status:false,message: 'something wrog while accepting' });
 }
}else{
 return res.status(400).json({ status:false,message: 'Connection request error.' });
}
}
}
}
}catch (error) {
 
   return res.status(500).json({ message: 'Internal server error.' });
 }
}

exports.sendNotification = async (req, res) => {
  try {
    const { token } = req.body;

    const message = {
      notification: {
        title: 'New message',
        body: 'You have a new message from John',
       
      },
      token: token
    };
    const response = await admin.messaging().send(message);


    res.status(200).send({ Status: true, message: 'Notification sent successfully' });
  } catch (err) {
    
    res.status(500).send({ Status: false, message: 'Failed to send notification' });
  }
}
exports.deleteComment = async (req, res) => {
  try {
    const { comment_id, deleter_id } = req.body;
    if (!comment_id || !deleter_id) {
      return res.status(400).json({ Status: false, message: "Please provide all the details" });
    } else {
      const findToDelete = await comment.findOne({ _id: comment_id });
      const onlyReply = await replycomment.findOne({ _id: comment_id });

      if (findToDelete !== null) {
        const post_id = findToDelete.post_id;
        const poster = await post.findOne(
          { _id: post_id },
          { _id: 0, user_id: 1 }
        );
        const commentDetails = findToDelete.commentdetails;

        if (poster && commentDetails && commentDetails._id.toString() === deleter_id || poster.user_id.toString() === deleter_id) {
          const response = await comment.findOneAndDelete({ _id: comment_id });
          await replycomment.deleteMany({ comment_id: comment_id });
          await notification.deleteMany({ comment_id: comment_id });

          const data = await comment.find({ post_id: post_id });
          const data1 = await replycomment.find({ post_id: post_id });
          const overallLength = data.length + data1.length;

          await post.findOneAndUpdate({ _id: post_id }, { $set: { totalcomments: overallLength } });

          if (response) {
            return res.status(200).json({ Status: true, message: "Comment Deleted Successfully", response });
          } else {
            return res.status(400).json({ Status: false, message: "Could not delete any comment, please try again later" });
          }
        } else {
          return res.status(400).json({ Status: false, message: "You do not have permission to delete this comment" });
        }
      } else if (onlyReply !== null) {
        const post_id = onlyReply.post_id;
        const id = onlyReply._id;

        const poster = await post.findOne(
          { _id: post_id },
          { _id: 0, user_id: 1 }
        );

        const commentDetails = onlyReply.commentdetails;

        if (poster && commentDetails && commentDetails._id.toString() === deleter_id && poster.user_id.toString() === deleter_id) {
          const response = await replycomment.findOneAndDelete({ _id: comment_id });
          await notification.deleteMany({ replycomment_id: comment_id });

          const data1 = await replycomment.find({ post_id: post_id });
          const overallLength = data1.length;

          await post.findOneAndUpdate({ _id: post_id }, { $set: { totalcomments: overallLength } });

          if (response) {
            return res.status(200).json({ Status: true, message: "Comment Deleted Successfully", response });
          } else {
            return res.status(400).json({ Status: false, message: "Could not delete any comment, please try again later" });
          }
        } else {
          return res.status(400).json({ Status: false, message: "You do not have permission to delete this comment" });
        }
      } else {
        return res.status(400).json({ Status: false, message: "Could not find a comment to delete" });
      }
    }
  } catch (err) {
    return res.status(400).json({ Status: "Error", error: err });
  }
};
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
    const hiii=await post.findOne({_id:post_id},{_id:0,user_id:1})
    const userid=hiii.user_id
    const ids=await Users.findOne({_id:userid},{_id:0,name:1,profile_img:1})
    const name=ids.name
    const profile_img=ids.profile_img
    const names=await Users.find({name:{$in:Tagged_people}})
    const userIds = names.map(doc => doc._id);
const userTokens = names.map(doc => doc.token);

const notification = {
  title: `Soulipie`,
  body: `${name} Tagged In Their Post`,
  icon:profile_img
}
const data={
  page_name:'Notification'
}
const notifydata=await admin.messaging().sendToDevice(userTokens,{notification,data});
const notifyData = userIds.map((userId, index) => ({
  user_id: userid,
  post_id:post_id,
tagged_post:notification,
tagged_post_userid:userId
}));
await notifications.insertMany(notifyData)
    const response=await post.findOne({_id:post_id})
      res.status(200).json({status:true,message:'Post edited Successfully',response,notifydata})
    }else{
      return res.status(400).json({Status:false,message:'could not update details'})
    }
  }else{
    const respons=await post.findOneAndUpdate({_id:post_id},{$set:{Post_discription:Post_discription}})
    const data=await post.findOneAndUpdate({_id:post_id},{$push:{Tagged_people:{ $each: Tagged_people }}})
    if(respons&&data){  
      const hiii=await post.findOne({_id:post_id},{_id:0,user_id:1})
      const userid=hiii.user_id
      const ids=await Users.findOne({_id:userid},{_id:0,name:1,profile_img:1})
      const name=ids.name
      const profile_img=ids.profile_img
      const names=await Users.find({name:{$in:Tagged_people}})
      const userIds = names.map(doc => doc._id);
  const userTokens = names.map(doc => doc.token);

  const notification = {
    title: `Soulipie`,
    body: `${name} Tagged In Their Post`,
    icon:profile_img
  }
  const data={
    page_name:'Notification'
  }
  const notifydata=await admin.messaging().sendToDevice(userTokens,{notification,data});
  const notifyData = userIds.map((userId, index) => ({
    user_id: userId,
    post_id:post_id,
    tagged_post:notification,
  tagged_post_userid:userid
  }));
  await notifications.insertMany(notifyData)
      const response=await post.findOne({_id:post_id})
        res.status(200).json({status:true,message:'Post edited Successfully',response,notifydata})
      }else{
        return res.status(400).json({Status:false,message:'could not update details'})
      }
  }  
  }catch(err){
    
       return res.status(400).json({Status:'Error',Error})
    }
}
exports.rejectRequest=async(req,res)=>{
  try{
  const {fromUser,toUser}=req.body
  if(!fromUser&&!toUser){
    return res.status(400).json({status:false,message:'Please provide all the details'})
  }
  else{
    const request=await connection.findOne({fromUser:fromUser,toUser:toUser})
  
    if(request){
      const touser=request.toUser
      const formuser=request.fromUser
      const reject=await Users.findOne({_id:formuser},{_id:1,profile_img:1,name:1,token:1})
      
      const name=reject.name
      const profile_img=reject.profile_img
    
      if(reject){
      const data=await users.updateOne({user_id:touser},{$pull:{totalrequest:reject}})
  
      if(data){
        const notification = {
          title: 'Soulipie',
          body: `${name} would like to connect with you`,
         icon:profile_img,
        };
        const data1=await notifications.findOneAndDelete({user_id:touser,request:notification})
      if(data1){
        const response=await connection.findOneAndDelete({fromUser:fromUser,toUser:toUser})
        return res.status(200).json({status:true,message:'Request Rejected Successfully',response})
      }else{
        return res.status(400).json({status:false,message:'No notification found'})
      }
       
      }else{
        return res.status(400).json({status:false,message:'couldnot find request in userprofile'})
      }
  }else{
    return res.status(400).json({status:false,message:'No request found'})
  }
}else{
  return res.status(400).json({status:false,message:'count find user details'})
}
}
}catch(err){

    return res.status(400).json({status:'Error',message:'somthing went wrong',err})
}
}
exports.loginViaOtp = async (req, res) => {             
  try{
      const {mobilenumber,token}=req.body
      if(!mobilenumber&&!token){
        return res.status(400).send({Status:false,message:'Please provide Mobile number'})
  }else{
    const chek=await Users.findOne({mobilenumber:mobilenumber},{otp:1,profile:1})
    if(chek!==null){
    const otp=chek.otp
    const profile=chek.profile
    if(profile==='true'&&otp==='true'){
    const data=await Users.findOneAndUpdate({mobilenumber:mobilenumber},{$set:{token:token}})
    const response=await Users.findOne({mobilenumber:mobilenumber},{_id:1,name:1})
     
    if(response){
const _id=response._id

const user_id = mongoose.Types.ObjectId(_id);
const conne=await users.updateMany(  {"totalrequest._id":user_id},
  { $set: { "totalrequest.$.token": token } })

const posts = await post.updateMany({
  "likedpeopledata._id": user_id
},{$set:{'likedpeopledata.$.token':token}});
const likeposts=await likespost.updateOne({
  "likesofposts._id": user_id
},{$set:{'likesofposts.$.token':token}});
const commentzsd= await comment.updateMany({
  "commentdetails._id": user_id
},{$set:{'commentdetails.token':token}});

const commentlike= await comment.updateMany({
  "commentlikerDetails._id": user_id
},{$set:{'commentlikerDetails.$.token':token}});

const replycomments=await replycomment.updateMany({
  "commentdetails._id": user_id
},{ $set: { "commentdetails.token": token} })

const replycommentslike=await replycomment.updateMany({
  "commentlikerDetails._id": user_id
},{$set:{'commentlikerDetails.$.token':token}})

const connectconnectios=await users.updateMany({
  "connections._id": user_id
},{$set:{'connections.$.token':token}})

      return res.status(200).send({Status:true,message:'otp Sent Successfully to Your Mobilenumber',response})
    }else{
      return res.status(400).send({Status:false,message:'Number does not exists'})
    }
  }else{
    return res.status(400).send({Status:false,message:'We request you to re-register once more'})
  }
}else{
  return res.status(400).send({Status:false,message:'Number does not exists'})
}
}
}catch(err){

      return res.status(400).send({Status:'Error',message:'somthing went wrong'})
     }                    
}
exports.Message = async (req, res) => {
  try {
    const sender_id = req.body.sender_id;
    const name = req.body.senderName;
    const msg = req.body.msg;
    const roomid = req.body.room_id;
    if (!sender_id || !name || !roomid) {
      res.status(406).json({ message: "sender_id, senderName, room_id are required" });
    } else {
      const store = storeMsg({
        sender_id: sender_id,
        senderName: name,
        message: msg,
        room_id: roomid,
        image: '',
        video: '',
        audio: ''
      });
      const result = await store.save();
      if (result) {
        const datas = await Users.findOne({ _id: sender_id }, { name: 1, profile_img: 1 });
        const names = datas.name;
        const profile_img = datas.profile_img;
        const userdata = await chatModule.findOne({ room_id: roomid }, { _id: 0, sender_id: 1, other_id: 1 });
        const id = userdata.sender_id.toString();
        if (id === sender_id) {
          const tokens = await Users.findOne({ _id: userdata.other_id }, { _id: 0, token: 1, profile_img: 1 });
          const token = tokens.token;
          const isroomother = await isRoom.findOne({ sender_id: userdata.other_id, room_id: roomid, isChatroom: true });
       
        if(!isroomother){
          const notification = {
            title: `${names} Sent A message`,
            body: `${msg}`,
            icon: profile_img
          };
          const data = {
            type: 'Chat',
            other_id: sender_id,
            name: names
          };
          const response = await admin.messaging().sendToDevice(token, { notification, data });
return res.status(200).send({ status: "Success", message: "Store Message Successfully", result, response });
        }else{
          return res.status(200).send({ status: "Success", message: "Store Message Successfully", result});
        }
        } else{
          const tokens = await Users.findOne({ _id: userdata.sender_id }, { _id: 0, token: 1, profile_img: 1 });
          const token = tokens.token;
          const isroomsender = await isRoom.findOne({ sender_id: userdata.sender_id, room_id: roomid, isChatroom: true });
          
          if(!isroomsender){
          const notification = {
            title: `${names} Sent A message`,
            body: `${msg}`,
            icon: profile_img
          };
          const data = {
            type: 'Chat',
            other_id: sender_id,
            name: names
          };
          const response = await admin.messaging().sendToDevice(token, { notification, data });
          return res.status(200).send({ status: "Success", message: "Store Message Successfully", result, response });
        }else{
          return res.status(200).send({ status: "Success", message: "Store Message Successfully", result});
        }
      }
      } else {
        return res.status(200).json({ status: "failure", message: "Some Technical Issue" });
      }
    }
  }
  catch(err){
      return res.status(400).send({ErrorMessage:"Somthing Wrong"})
  }
}
exports.image = async (req, res, next) => {
  try {
    
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
        const datas=await Users.findOne({_id:sender_id},{name:1,profile_img:1})
        const names=datas.name
        const profile_img=datas.profile_img
        const userdata=await chatModule.findOne({room_id:room_id},{_id:0,sender_id:1,other_id:1})
      
         const id=userdata.sender_id.toString()
      
        if (id === sender_id) {
            const tokens=await Users.findOne({_id:userdata.other_id},{_id:0 ,token:1,profile_img:1})
            const token=tokens.token
            const isroomother = await isRoom.findOne({ sender_id: userdata.other_id, room_id: room_id, isChatroom: true });
            
            if(!isroomother){
            const notification = {
              title: `Soulipie`,
              image:'https://soulipiebucket2.s3.ap-south-1.amazonaws.com/images/'+image,
              body: `${names} Sent A meesage `,
              icon:profile_img
            };
            const data={
              type:'Chat',
              other_id:sender_id,
              name:names
             }
            const response=await admin.messaging().sendToDevice(token,{notification,data});
             
        return res.status(200).send({status:"Success",message:"Store Message Successfully",result,response})
            }else{
              return res.status(200).send({status:"Success",message:"Store Message Successfully",result})
            }
          } else {
            const tokens=await Users.findOne({_id:userdata.sender_id},{_id:0 ,token:1,profile_img:1})
            const token=tokens.token
            const isroomsender = await isRoom.findOne({ sender_id: userdata.sender_id, room_id: room_id, isChatroom: true });
          
          if(!isroomsender){
            const notification = {
              title: `Soulipie`,
              image:'https://soulipiebucket2.s3.ap-south-1.amazonaws.com/images/'+image,
              body: `${names} Sent A meesage`,
              icon:profile_img
            };
            const data={
              type:'Chat',
              other_id:sender_id,
              name:names
             }
            const response=await admin.messaging().sendToDevice(token,{notification,data});
            return res.status(200).send({status:"Success",message:"Store Message Successfullys",result,response})
            
          }else{
            return res.status(200).send({status:"Success",message:"Store Message Successfullys",result})
          }
        }
       
      }
      else{
        return res.status(200).json({stauts:"Success",message:"Some Technical Issue"})
      }
  }else{
      res.send({status:"faluier",message:"couldnt upload"})
  } 
}catch (err) {
  
    res.send({ ErrorMessage: "Something Error", err });
    
  }
}
exports.video=async(req,res,next)=>{

  try{
     
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
            const datas=await Users.findOne({_id:sender_id},{name:1,profile_img:1})
            const names=datas.name
            const profile_img=datas.profile_img

            const userdata=await chatModule.findOne({room_id:room_id},{_id:0,sender_id:1,other_id:1})
      
            const id=userdata.sender_id.toString()
         
            
            if (id === sender_id) {
              const tokens=await Users.findOne({_id:userdata.other_id},{_id:0 ,token:1,profile_img:1})
              const token=tokens.token
              const isroomother = await isRoom.findOne({ sender_id: userdata.other_id, room_id: room_id, isChatroom: true });
            
            if(!isroomother){
              const notification = {
                title: `Soulipie`,
                body: `${names} Send A Video`,
                icon:profile_img
              }
              const data={
                type:'Chat',
          other_id:sender_id,
          name:names
               }
              const response=await admin.messaging().sendToDevice(token,{notification,data});

              return res.status(200).send({status:"Success",message:"Store Message Successfully",result,response})
            }else{
              return res.status(200).send({status:"Success",message:"Store Message Successfully",result})
            }
           } else {
              const tokens=await Users.findOne({_id:userdata.sender_id},{_id:0 ,token:1,profile_img:1})
              const token=tokens.token
              const isroomsender = await isRoom.findOne({ sender_id: userdata.sender_id, room_id: room_id, isChatroom: true });
              
              if(!isroomsender){
              const notification = {
                title: `Soulipie`,
                body: `${names} Send A Video`,
                icon:profile_img
              };
              
              const data={
                type:'Chat',
                sender_id:sender_id,
                name:names
               }
              const response=await admin.messaging().sendToDevice(token,{notification,data});
              return res.status(200).send({status:"Success",message:"Store Message Successfullys",result,response})
            }else{
              return res.status(200).send({status:"Success",message:"Store Message Successfullys",result})
            }
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
     
      if(req.file){
          const sender_id=req.body.sender_id
          const name=req.body.senderName
          const audio=req.file.filename
          const roomid=req.body.room_id
          const msg=req.body.message
          const store=storeMsg({
              sender_id:sender_id,
              senderName:name,
              room_id:roomid,
              message:msg,
              audio:audio
          })
          const result= await store.save();
          if(result)
          {

            const datas=await Users.findOne({_id:sender_id},{name:1,profile_img:1})
            const names=datas.name
            const profile_img=datas.profile_img

            const userdata=await chatModule.findOne({room_id:roomid},{_id:0,sender_id:1,other_id:1})
        
             const id=userdata.sender_id.toString()
          
            if (id === sender_id) {
             const tokens=await Users.findOne({_id:userdata.other_id},{_id:0 ,token:1,profile_img:1})
             const token=tokens.token
             const isroomother = await isRoom.findOne({ sender_id: userdata.other_id, room_id: roomid, isChatroom: true });
        
        if(!isroomother){
                const notification = {
                  title: `Soulipie`,
                  body: `${names} Sent A Audio`,
                 icon:profile_img
                }; 
                const data={
                  type:'Chat',
                  other_id:sender_id,
                  name:names
                 }
                const response=await admin.messaging().sendToDevice(token,{notification,data});
                 
            return res.status(200).send({status:"Success",message:"Store Message Successfully",result,response})
              }else{
                return res.status(200).send({status:"Success",message:"Store Message Successfully",result})
              }
             } else {
                const tokens=await Users.findOne({_id:userdata.sender_id},{_id:0 ,token:1,profile_im:1})
                const token=tokens.token
                const isroomsender = await isRoom.findOne({ sender_id: userdata.sender_id, room_id: roomid, isChatroom: true });
          
          if(!isroomsender){
                const notification = {
                  title: `Soulipie`,
                  body: `${names} Sent A Audio`,
                 icon:profile_img

                };  
                const data={
                  type:'Chat',
                  other_id:sender_id,
                  name:names
                 }
                const response=await admin.messaging().sendToDevice(token,{notification,data});
                return res.status(200).send({status:"Success",message:"Store Message Successfullys",result,response})
          }else{
            return res.status(200).send({status:"Success",message:"Store Message Successfullys",result})
          }
              }
          }
      }
      else{
          res.send({ErrorMessage:'Please choose Audio file'})
        }
  }
  catch(err){
      res.send({ErrorMessage:"Somthing Error",err})
  }
}