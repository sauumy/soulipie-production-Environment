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
const serviceAccount = require('../../nita-8a544-firebase-adminsdk-p3pml-64ea0bb787.json');
const post=require("../models/posts")
const likespost=require('../models/likespost')
const comment=require('../models/comments');
const replycomment=require('../models/replycomment')
const storeMsg=require('../models/storemssage')
const {chatModule}=require('../models/chatmodule')

const notification = require('../models/notification');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://soulipie-9ac7d-default-rtdb.firebaseio.com"
  });

  const messaging = admin.messaging();
  const fetch = require('node-fetch');



  
exports.deeplink = async (req, res) => {
    try {
      const link = req.body.link; 
      const _id = req.body._id; 
      const androidPackageName = 'com.soulipie_app'; 
      const apikey = 'AIzaSyBhlTa0Yj8wM-Fk4Z5SjJtRvAE_E-nHJzI'; 
      const url = `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${apikey}`;
      
      const response = await fetch(url, {method: 'POST', headers: {'Content-Type': 'application/json'},

  body: JSON.stringify({dynamicLinkInfo: {domainUriPrefix: 'https://soulipieapp.page.link',link: link,
  androidInfo: {androidPackageName: androidPackageName,androidFallbackLink: 'https://play.google.com/store/apps/details?id=com.hiddenlyy'
            },
  socialMetaTagInfo: {socialTitle: 'Check out this link!',socialDescription: 'This is the description of the link',},
          },
          suffix: {
            option: 'SHORT',
          },
        }),
      });
     const data = await response.json();
      console.log(`Generated Dynamic Link: ${data.shortLink}`);
      
      res.json({Status:true,message:"deep link created",shortLink: data.shortLink,_id: _id,});
    } catch (error) {console.error(error);
      res.status(500).json({message: 'An error occurred while generating the Dynamic Link.',
      });
    }
  };


  


//     try{  
//         if(req.body.email){
//             if(!req.body.email){
//                 return res.status(406).send({Status:false,message:'Email is required field'})
//             }
//             else{
//             let account;
//             account = await chaservice.findAccount(req.body.email)
//             if(account){
//                 return res.status(406).send({Status:false,message:'You have already registerd with souliepie please login'})
//             }
//             else if(!account){
//         const user=new Users({
//             email:req.body.email,
//         });
       
//         if(user)
//             {
//                 const account1 = await user.save()
//                 account= account1 
//                 account = await chaservice.findByMobileNumber(req.body.mobilenumber)
//                 const Authorization  = jwtTokenService.generateJwtToken({user_id:account._id,LoggedIn:true})
//                 await jwtTokenService.storeRefreshToken(Authorization,account._id)
                                     
//                                      let otp = Math.floor(1000 + Math.random() * 9000);
//                                      const emails = await service.sendmail(req.body.email,otp)                  
//                 let time = 1000*60*5
//                 let expires = Date.now()+time
//                 let data = `${req.body.email}.${otp}.${expires}`
//                 let result = otpService.hashData(data)
//                                     return res.status(200).send({
//                                         Status:true,
//                                         message:'otp send sucessfully on email',
//                                         name:req.body.name,
//                                         hashdata:`${result}.${expires}`,
//                                         otp,
//                                         email:req.body.email
//                                     })
                                    
//                                 }else{
//                                     return res.status(400).send({Status:false,message:'account is not found',Error})
//                                 }
//                             }
          
//         }
//     }
//        else  if(req.body.mobilenumber){
//       if(!req.body.mobilenumber){
//             return res.status(406).send({Status:false,message:'Mobilenumber is required field'})
//         }
//         else {
//             let account;
//             account = await chaservice.findByMobileNumber(req.body.mobilenumber)
//             if(account){
//                 return res.status(406).send({Status:false,message:'You have already registerd with souliepie please login'})
//             }
//             else{
//             if (!account){
//                 const user=new Users({   
//                     mobilenumber:req.body.mobilenumber,
                    
                     
//                           })
                          
                          
                          
//                             const account1 = await user.save()
//                             account= account1 
//                             account = await chaservice.findByMobileNumber(req.body.mobilenumber)
//                             const Authorization  = jwtTokenService.generateJwtToken({user_id:account._id,LoggedIn:true})
//                             await jwtTokenService.storeRefreshToken(Authorization,account._id)
                
//             }
//         }
    
//             let mobilenumber;
           
//             let otp = otpService.generateOtp(1000,9999)
            
//                    mobilenumber = await service.sendOtpOnMobile(req.body.mobilenumber,otp)
                
//                 let time = 1000*60*5
//                 let expires = Date.now()+time
//                 let data = `${req.body.mobilenumber}.${otp}.${expires}`
//                 let result = otpService.hashData(data)
//                 if(mobilenumber===true){
//                     return res.status(200).send({
//                         Status:true,
//                         message:'otp send sucessfully on mobilenumber',
//                         name:req.body.name,
//                         hashdata:`${result}.${expires}`,
//                         otp,
//                         mobilenumber:req.body.mobilenumber,
                        
//                     })
//                 }
//                 else{
//                     return res.status(406).send({Status:false,message:'name ormobilenumber is not Valid'})
//                 }
           
            
//     }
//     }
// }
//     catch(err){
//          console.log('registrtion error',err);
//         return res.status(400).send({Status:'Error',message:'somthing went wrong'})
//        }                    
//  };
exports.callID=async(req,res)=>{
    try{
const {host_id,joiner_id,callerId}=req.body

if(!host_id|| !joiner_id){
    res.send({ErrorMessage:"Please Before Provide user_id and other_id"})
   }
else{
console.log(host_id,typeof host_id ,joiner_id,typeof joiner_id)
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
console.log(joiner_id,host_id)
  var response=await callerID.find({
        $or:[{host_id:host_id,joiner_id:joiner_id},{host_id:joiner_id,joiner_id:host_id}]
  });
  if(response.length!=0){
 console.log(response)
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
  console.log(result)
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
         console.log('LoginViaOtperror',err);
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
                    return res.status(400).send({Status:'false',message:'otp verified already'})
        }
}else{
  return res.status(400).send({Status:'false',message:'please provide mobilenumber'})
}
}catch(err){
    console.log(err);
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
 
    if(otp==='true'&&profile==='true'){
      return res.status(400).send({Status:false,message:'You have already registerd with the Soulipie'})
    }else if (otp==='true'&&profile==='false'){
      return res.status(400).send({Status:false,message:'otp verified'})
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
       console.log('registrtion error',err);
      return res.status(400).send({Status:'Error',message:'somthing went wrong'})
     }                    
};
  

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
        console.log(name)
        const data=await Users.findOne({_id:toUser},{_id:0,token:1})
        const token=data.token
        console.log(token)
      const touser=await users.findOne({user_id:toUser})
      if(touser){
        const update=await users.findOneAndUpdate({user_id:toUser},{$push:{totalrequest:sender}})
        
        if(update){
          const notification = {
              title: 'Soulipie',
              body: `${name} would like to connect with you.`,
              icon: profile_img,
            };
            if(notification){
              const noti=new notifications({
                user_id:toUser,
                request:notification
              })
              await noti.save()
            }
          await admin.messaging().sendToDevice(token,{notification});
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
            body: `${name} would like to connect with you.`,
            icon: profile_img,
          }
          const data={
            page_name:'send_request'
          }
        
          if(notification){
            
            const noti=new notifications({
              user_id:toUser,
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
        console.log(error);
        return res.status(500).json({ status:false,message: 'Internal server error.' });
      }
    }

  exports.requestCount=async(req, res)=>{
  try {
  const {_id}=req.params
   const request=await users.findOne({user_id:_id},{totalrequest:1,_id:0})
  const requests=request.totalrequest
  const requestcount=requests.length
  if(request){
  return res.status(200).json({status:true, message: 'requests fetch successfully.',requestcount });
  }else{
      return res.status(400).json({ status:false,message: 'Counldnt sind any request' });
  }
  
  }catch (error) {
              console.log(error);
              return res.status(500).json({status:false, message: 'Internal server error.' });
      }
  }
  exports.getRequest=async(req, res)=>{
    try {
    const {_id}=req.params
     const request=await users.findOne({user_id:_id},{totalrequest:1,_id:0})
    const requests=request.totalrequest
    
    if(request){
    return res.status(200).json({status:true, message: 'requests fetch successfully.',requests });
    }else{
        return res.status(400).json({ status:false,message: 'Counldnt sind any request' });
    }
    
    }catch (error) {
                console.log(error);
                return res.status(500).json({status:false, message: 'Internal server error.' });
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
        if(sender){
        const totalrequest=await users.updateOne({user_id:toUser},{$pull:{totalrequest:sender}})
       
        console.log(totalrequest)
        if(totalrequest){
          const connection=await users.updateOne({user_id:toUser},{$push:{connections:sender}})
          if(connection){
              const notification = {
                  title: 'Soulipie',
                  body: `${name} accepte you request connection.`,
                  icon:profile_img
                };
                if(notification){
                  const noti=new notifications({
                    user_id:fromUser,
                    accpeted:notification
                  })
                  await noti.save()
                }
               
              await admin.messaging().sendToDevice(token,{notification});
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
        console.log(error);
        return res.status(500).json({ message: 'Internal server error.' });
      }
    }
exports.getNotification=async(req,res)=>{
  try{
    const {_id}=req.params
    const response =await notifications.find({user_id:_id})
    if(response){
      return res.status(200).json({status:true ,message: `get notification successfully`,response});
    }else{
      return res.status(400).json({ status:false,message: 'Coulnt load notification' });
    }
  }catch (error) {
        console.log(error);
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
    console.log('err',err.message);
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
      const data=await post.findOne({post_id:post_id},{_id:0,user_id:1})
      const data1=data.user_id
      
      const user_id=await Users.findOne({_id:data1},{_id:0,token:1})
      const token=user_id.token
      const likesPost = await likespost.findOne({ post_id: post_id });
      console.log(likesPost)
      if (likesPost) {
        const likesOfPosts = likesPost.likesofposts;
        console.log(likesOfPosts);
        if (likesOfPosts.length>0&&likesOfPosts.some((obj) => obj._id.toString() === liker_id)) {
          const response=await likespost.updateOne({ post_id: post_id }, { $pull: { likesofposts: liker } });
          console.log('Liker removed from likesofposts',response);
          if(response){
            const count=await likespost.findOne({post_id:post_id})
            const likes=count?count.likesofposts.length : 0
            console.log(likes)
            const totallikes=await likespost.findOneAndUpdate({post_id:post_id},{$set:{totallikesofpost:likes}})
            await post.findOneAndUpdate({_id:post_id},{$set:{totallikesofpost:likes}})
            await post.updateOne({_id:post_id},{ $pull:{likedpeopledata:liker}})
            if(totallikes){
              const notification = {
                title: 'Soulipie',
                body: `${name} Liked your Post`,
                icon: profile_img,
              };
              if(notification){
                await notifications.findOneAndDelete({user_id:data1,likespost:notification})
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
          console.log('Liker added to likesofposts',response);
          if(response){
            const count=await likespost.findOne({post_id:post_id})
        const likes=count?count.likesofposts.length : 0
        console.log(likes)
        const totallikes=await likespost.findOneAndUpdate({post_id:post_id},{$set:{totallikesofpost:likes}})
        const total=await post.updateOne({_id:post_id},{$set:{totallikesofpost:likes}})
        await post.updateOne({_id:post_id},{ $push:{likedpeopledata:liker}})
        if(totallikes&&total){
            const notification = {
                                      title: 'Soulipie',
                                      body: `${name} Liked your Post`,
                                      icon: profile_img,
                                    };
                                                          if(notification){
                                                            const noti=new notifications({
                                                              user_id:data1,
                                                              likespost:notification
                                                            })
                                                            await noti.save()
                                                          }
                                                        await admin.messaging().sendToDevice(token,{notification});
                                              return res.status(200).json({Status:true,message:'liked your post',notification})
          }else{
            return res.status(400).json({ Status: true, message: 'coudnt Liker added to likesofposts' });
          }
        }else{
            return res.status(400).json({ Status: false, message: 'Eoror while Liker adding to likesofposts' });
          }
        }
      } else {
        const data = new likespost({
          post_id: post_id,
          likesofposts: liker
        });
        const response=await data.save();
        console.log(response);
        if(response){
          const count=await likespost.findOne({post_id:post_id})
          const likes=count?count.likesofposts.length : 0
          console.log(likes)
          const totallikes=await likespost.findOneAndUpdate({post_id:post_id},{$set:{totallikesofpost:likes}})
          const total=await post.updateOne({_id:post_id},{$set:{totallikesofpost:likes}})
          await post.updateOne({_id:post_id},{ $push:{likedpeopledata:liker}})
          if(totallikes&&total){
            const notification = {
              title: 'Soulipie',
              body: `${name} Liked your Post`,
              icon: profile_img,
            };
            if(notification){
              const noti=new notifications({
                user_id:data1,
                likespost:notification
              })
              await noti.save()
            }
          await admin.messaging().sendToDevice(token,{notification});
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
    console.log('err', err.message);
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
  const data=await post.findOne({post_id:post_id},{_id:0,user_id:1})
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
    if(response){
      const notification = {
        title: 'Soulipie',
        body: `${name} Commented On your Post`,
        icon: profile_img,
      };
      
      if(notification){
        const noti=new notifications({
          user_id:user_id,
          comment:notification
        })
        await noti.save()
      }
    await admin.messaging().sendToDevice(token,{notification});
    
    const count =Number(await comment.find({ post_id: post_id }).countDocuments());
    const counts=Number(await replycomment.find({post_id:post_id}).countDocuments())
    console.log(count,counts)
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
    console.log('err',err.message);
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
  console.log(data)
  const user_id = data.commentdetails._id
  const token = data.commentdetails.token
  console.log(user_id)
  
  console.log(token)
if(response){
  const commentlikerDetails = response.commentlikerDetails;
        console.log(commentlikerDetails);
  if (commentlikerDetails.some((obj) => obj._id.toString() === liker_id)) {
  const response=await comment.updateOne({post_id:post_id,_id:comment_id},{$pull:{commentlikerDetails:liker}})
  if(response){
    const count=await comment.findOne({post_id:post_id,_id:comment_id})
    const likes=count?count.commentlikerDetails.length : 0
    console.log(likes)
    const totallikes=await comment.findOneAndUpdate({post_id:post_id,_id:comment_id},{$set:{totallikesofcomments:likes}})
    if(totallikes){
      const notification = {
        title: 'Soulipie',
        body: `${name} Liked your Comment`,
        icon: profile_img,
      };
      
      if(notification){
        await notifications.findOneAndDelete({user_id:user_id,likecomment:notification})
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
  console.log('Liker added to likesofposts',response);
  if(response){
    const count=await comment.findOne({post_id:post_id,_id:comment_id})
const likes=count?count.commentlikerDetails.length : 0
console.log(likes)
const totallikes=await comment.findOneAndUpdate({post_id:post_id,_id:comment_id},{$set:{totallikesofcomments:likes}})
if(totallikes){
    const notification = {
                              title: 'Soulipie',
                              body: `${name} Liked your Comment`,
                              icon: profile_img,
                            };
                            
                                                  if(notification){
                                                    const noti=new notifications({
                                                      user_id:user_id,
                                                      likecomment:notification
                                                    })
                                                    await noti.save()
                                                  }
                                                await admin.messaging().sendToDevice(token,{notification});
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
    console.log('err',err.message);
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
    return res.status(400).json({ Status: true, message: 'All the Comments of Post',response });
  }else{
    return res.status(400).json({ Status: false, message: 'Couldnot find Any Comment For The Post' });
  }
}
}catch(err){
    console.log('err',err.message);
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
  const posting=await post.findOne({post_id:post_id},{_id:0,user_id:1})
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
    if(response){
      const notification = {
        title: 'Soulipie',
        body: `${name} Commented On your Post`,
        icon: profile_img,
      };
      const data= {
        title: 'Soulipie',
        body: `${name} Mentioned You On Comment`,
        icon: profile_img,
      };
      if(notification&&data){
        const noti=new notifications({
          user_id:poster,
          replyComment:notification
        })
        await noti.save()
        const notis=new notifications({
          user_id:user_id,
          mentioned:data
        })
        await notis.save()
      }
    await admin.messaging().sendToDevice(token,{notification});
    await admin.messaging().sendToDevice(postertoken,{data});
    const count =Number(await comment.find({ post_id: post_id }).countDocuments());
    const counts=Number(await replycomment.find({post_id:post_id}).countDocuments())
    console.log(count,counts)
    const total=count+counts
    await post.findOneAndUpdate({_id:post_id},{$set:{totalcomments:total}})
return res.status(200).json({Status:true,message:'Commented On Your POst',response,notification,data})

    }else{
 return res.status(400).json({ Status: false, message: 'Eoror while Commenting the Data' });
    }

  }else{
    return res.status(400).json({ Status: false, message: 'nno post found' });
  }
}

}catch(err){
    console.log('err',err.message);
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
  console.log(data)
  const token=data.commentdetails.token
  console.log(token)
  const user_id=data.commentdetails._id
  console.log(user_id)
if(response){
  const commentlikerDetails = response.commentlikerDetails;
        console.log(commentlikerDetails);
  if (commentlikerDetails.some((obj) => obj._id.toString() === liker_id)) {
  const response=await replycomment.updateOne({_id:replycomment_id},{$pull:{commentlikerDetails:liker}})
  if(response){
    const count=await replycomment.findOne({_id:replycomment_id})
    const likes=count?count.commentlikerDetails.length : 0
    console.log(likes)
    const totallikes=await replycomment.findOneAndUpdate({_id:replycomment_id},{$set:{totallikesofcomments:likes}})
    if(totallikes){
      const notification = {
        title: 'Soulipie',
        body: `${name} Liked your Comment`,
        icon: profile_img,
      };
      
      if(notification){
        await notifications.findOneAndDelete({user_id:user_id,replyCommentlike:notification}) 
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
  console.log('Liker added to likesofposts',response);
  if(response){
    const count=await replycomment.findOne({_id:replycomment_id})
const likes=count?count.commentlikerDetails.length : 0
console.log(likes)
const totallikes=await replycomment.findOneAndUpdate({_id:replycomment_id},{$set:{totallikesofcomments:likes}})
if(totallikes){
    const notification = {
                              title: 'Soulipie',
                              body: `${name} Liked your Comment`,
                              icon: profile_img,
                            };
                                                  if(notification){
                                                    const noti=new notifications({
                                                      user_id:user_id,
                                                      replyCommentlike :notification
                                                    })
                                                    await noti.save()
                                                  }
                                                await admin.messaging().sendToDevice(token,{notification});
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
    console.log('err',err.message);
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
    console.log(request)
    if(request){
      const touser=request.toUser
      const formuser=request.fromUser
      const reject=await Users.findOne({_id:formuser},{_id:1,profile_img:1,name:1,token:1})
      console.log(reject)
      const name=reject.name
      const profile_img=reject.profile_img
      console.log(reject)
      if(reject){
      const data=await users.updateOne({user_id:touser},{$pull:{totalrequest:reject}})
      console.log(data)
      if(data){
        const notification = {
          title: 'Soulipie',
          body: `${name} would like to connect with you.`,
          icon: profile_img,
        };
        const data1=await notifications.findOneAndDelete({user_id:touser,request:notification})
      if(data1){
        const response=await connection.findOneAndDelete({fromUser:fromUser,toUser:toUser})
        return res.status(400).json({status:true,message:'Request Rejected Successfully',response})
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
    console.log(err);
    return res.status(400).json({status:'Error',message:'somthing went wrong',err})
}
}

exports.deleteComment = async (req, res) => {
  try {
    const { comment_id, deleter_id,notification_id } = req.body;
    if (!comment_id || !deleter_id) {
        res.status(400).json({ Status: false, message: "Please provide all the details" });
    } else{
      const findtodelete = await comment.findOne({ _id: comment_id })
      const findtodeletes = await replycomment.find({ _id:{$in:comment_id}  });
      if(findtodelete){
      const post_id = findtodelete.post_id;
      const poster = await post.findOne(
        { _id: post_id },
        { _id: 0, user_id: 1 }
      );
      const commentdetails = findtodelete.commentdetails;
      console.log(commentdetails);
      if (
        commentdetails._id.toString() ===  deleter_id && poster
        )
       {
        const response = await comment.findOneAndDelete({ _id: comment_id });
        await replycomment.deleteMany({comment_id:comment_id})

        await notifications.deleteMany({_id:{$in:notification_id}})
        if (response) {
            res.status(400).json({ Status: true, message: "Comment Deleted Successfully", response });
        } else {
res.status(400).json({ Status: false, message: "Could not delete any comment try again later" });
        }
      } else {
        res.status(400).json({ Status: false, message: "You do not have permission to delete this comment" });
      }
    }else if(findtodeletes){
      const post_id = findtodeletes.post_id;
      const poster = await post.findOne(
        { _id: post_id },
        { _id: 0, user_id: 1 }
      );
      const commentdetails = findtodeletes.commentdetails;
      console.log(commentdetails);
      if (
        commentdetails._id.toString() ===  deleter_id && poster
        )
       {
        const response = await replycomment.findOneAndDelete({ _id: comment_id });
        await notifications.findOneAndDelete({_id:notification_id})
        if (response) {
            res.status(400).json({ Status: true, message: "Comment Deleted Successfully", response });
        } else {
res.status(400).json({ Status: false, message: "Could not delete any comment try again later" });
        }
      } else {
        res.status(400).json({ Status: false, message: "You do not have permission to delete this comment" });
      }
    }else{
      res.status(400).json({ Status: false, message: "coudnot find a comment to delete" });
    }
  }
  } catch (err) {
    console.log("err", err.message);
    return res.status(400).json({ Status: "Error", Error });
  }
};

exports.loginViaOtp = async (req, res) => {             
  try{
      const {mobilenumber,token}=req.body
      if(!mobilenumber&&!token){
        return res.status(400).send({Status:false,message:'Please provide Mobile number'})
  }else{
    const data=await Users.findOneAndUpdate({mobilenumber:mobilenumber},{$set:{token:token}})
    const response=await Users.findOne({mobilenumber:mobilenumber},{_id:1,name:1})
    if(response){
      return res.status(200).send({Status:true,message:'otp Sent Successfully to Your Mobilenumber',response})
    }else{
      return res.status(400).send({Status:false,message:'Number does not exists'})
    }
  }
}
  catch(err){
       console.log('LoginViaOtperror',err);
      return res.status(400).send({Status:'Error',message:'somthing went wrong'})
     }                    
};


exports.Message=async(req,res)=>{
  try{
      const otherid=req.body.sender_id
      const name=req.body.senderName
      const msg=req.body.msg
      const roomid=req.body.room_id
if(!otherid ||!name || !roomid){
  res.status(406).json({message:"sender_id ,senderName,room_id"})
}
else{
        const store=storeMsg({
          sender_id:otherid,
          senderName:name,
          message:msg,
          room_id:roomid,
          image:'',
    video:'',
    audio:''
      })
      const result= await store.save();
      if(result)
      {
          const userdata=await chatModule.findOne({room_id:roomid},{_id:0,sender_id:1,other_id:1})
          console.log(userdata)
           const id=userdata.sender_id.toString()
           console.log(id)
          if (id === otherid) {
              const tokens=await Users.findOne({_id:userdata.other_id},{_id:0 ,token:1})
              const token=tokens.token
              console.log(token)
              const notification = {
                title: `${name} Sent A meesage`,
                body: `${msg}`
                
              };
              const data={
                body: `${msg}`
              }
              const response=await admin.messaging().sendToDevice(token,{notification,data});
               
          return res.status(200).send({status:"Success",message:"Store Message Successfully",result,response})
            } else {
              const tokens=await Users.findOne({_id:userdata.sender_id},{_id:0 ,token:1})
              const token=tokens.token
              console.log(token)
              const notification = {
                title: `${name} Sent A meesage`,
                body: `${msg}`
              };  
              const data={
                body: `${msg}`
              }
              const response=await admin.messaging().sendToDevice(token,{notification,data});
              return res.status(200).send({status:"Success",message:"Store Message Successfullys",result,response})
              
            }
         
      }else{
  return res.status(400).json({stauts:"Success",message:"Some Technical Issue"})
}
   }
  }
  catch(err){
      console.log(err)
      return res.status(400).send({ErrorMessage:"Somthing Wrong"})
  }
}

exports.image = async (req, res, next) => {
  try {
    console.log(req.files);
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
          
        const userdata=await chatModule.findOne({room_id:room_id},{_id:0,sender_id:1,other_id:1})
        console.log(userdata)
         const id=userdata.sender_id.toString()
         console.log(id)
        if (id === sender_id) {
            const tokens=await Users.findOne({_id:userdata.other_id},{_id:0 ,token:1})
            const token=tokens.token
            console.log(token)
            const notification = {
              title: `Soulipie`,
              image:'https://soulipiebucket2.s3.ap-south-1.amazonaws.com/images/'+image,
              body: `${senderName} Sent A meesage ${message}`
              
            };
            const data={
              image:'https://soulipiebucket2.s3.ap-south-1.amazonaws.com/images/'+image,
              body: `${senderName} Sent A meesage ${message}`
            }
            const response=await admin.messaging().sendToDevice(token,{notification,data});
             
        return res.status(200).send({status:"Success",message:"Store Message Successfully",result,response})
          } else {
            const tokens=await Users.findOne({_id:userdata.sender_id},{_id:0 ,token:1})
            const token=tokens.token
            console.log(token)
            const notification = {
              title: `Soulipie`,
              image:'https://soulipiebucket2.s3.ap-south-1.amazonaws.com/images/'+image,
              body: `${senderName} Sent A meesage ${message}`
            };  
            const data={
              image:'https://soulipiebucket2.s3.ap-south-1.amazonaws.com/images/'+image,
              body: `${message}`
            }
            const response=await admin.messaging().sendToDevice(token,{notification,data});
            return res.status(200).send({status:"Success",message:"Store Message Successfullys",result,response})
            
          }
       
       
      }
      else{
        return res.status(400).json({stauts:"Success",message:"Some Technical Issue"})
      }
  }else{
      res.send({status:"faluier",message:"couldnt upload"})
  } 
}catch (err) {
  console.log(err)
    res.send({ ErrorMessage: "Something Error", err });
    
  }
}


exports.video=async(req,res,next)=>{
  try{
      console.log(req.file)
      if(req.files && req.files.length > 0){
          const sender_id=req.body.sender_id
          const senderName=req.body.senderName
          const room_id=req.body.room_id
          const message=req.body.message
          const video=req.files.map(file => file.filename)
          const upload = video.map(({ path, duration }) => new storeMsg({
            sender_id,
            senderName,
            room_id ,
            message,
            video: path,
            duration
          }));
          const result = await storeMsg.insertMany(upload)
          if(result)
          {
            const userdata=await chatModule.findOne({room_id:room_id},{_id:0,sender_id:1,other_id:1})
            console.log(userdata)
            const id=userdata.sender_id.toString()
            console.log(id)
            if (id === sender_id) {
              const tokens=await Users.findOne({_id:userdata.other_id},{_id:0 ,token:1})
              const token=tokens.token
              console.log(token)
              const notification = {
                title: `Soulipie`,
                body: `${senderName} Send A Video ${message}`,
              }
                const data={
                  body: `${message}`
                }
              const response=await admin.messaging().sendToDevice(token,{notification,data});

              return res.status(200).send({status:"Success",message:"Store Message Successfully",result,response})
            } else {
              const tokens=await Users.findOne({_id:userdata.sender_id},{_id:0 ,token:1})
              const token=tokens.token
              console.log(token)
              const notification = {
                title: `Soulipie`,
                body: `${senderName} Send A Video ${message}`,
              };
              const payload = {
                notification: notification,
                data: {
                  body: `${message}`,
                }
              };
              const response=await admin.messaging().sendToDevice(token,payload);
              return res.status(200).send({status:"Success",message:"Store Message Successfullys",result,response})
            }
          }
      }
      else{
          res.send({ErrorMessage:'Please choose image and video file'})
      }
  }
  catch(err){
      console.log(err)
      res.send({ErrorMessage:"Somthing Error",err})
  }
}


exports.audio=async(req,res,next)=>{
  try{
      console.log(req.file)
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
            const userdata=await chatModule.findOne({room_id:roomid},{_id:0,sender_id:1,other_id:1})
            console.log(userdata)
             const id=userdata.sender_id.toString()
             console.log(id)
            if (id === sender_id) {
                const tokens=await Users.findOne({_id:userdata.other_id},{_id:0 ,token:1})
                const token=tokens.token
                console.log(token)
                const notification = {
                  title: `Soulipie`,
                  body: `${name} Sent A Audio ${msg}`,
                 
                }; 
                const data={
                  body: `${msg}`
                }
                const response=await admin.messaging().sendToDevice(token,{notification,data});
                 
            return res.status(200).send({status:"Success",message:"Store Message Successfully",result,response})
              } else {
                const tokens=await Users.findOne({_id:userdata.sender_id},{_id:0 ,token:1})
                const token=tokens.token
                console.log(token)
                const notification = {
                  title: `Soulipie`,
                  body: `${name} Sent A Audio ${msg}`,
                 

                };  
                const data={
                  body: `${msg}`,

                }
                const response=await admin.messaging().sendToDevice(token,{notification,data});
                return res.status(200).send({status:"Success",message:"Store Message Successfullys",result,response})
                
              }
          }
      }
      else{
          res.send({ErrorMessage:'Please choose Audio file'})
      saveLiveAudioFile        }
  }
  catch(err){
      res.send({ErrorMessage:"Somthing Error",err})
  }
}
















exports.sendNotification = async (req, res) => {
  try {
    const { token } = req.body;

    const message = {
      notification: {
        title: 'Soulipie',
        body: 'This is a test notification',
        image: 'https://soulipiebucket2.s3.ap-south-1.amazonaws.com/images/profile_img_1683978094380.jpg', // URL to the image to display in the notification
      },
      android: {
        notification: {
          color: '#008000', // Change the background color of the notification on Android
        },
      },
      token: token,
    };

    const response = await admin.messaging().send(message);
    console.log('Notification sent:', response);

    res.status(200).send({ Status: true, message: 'Notification sent successfully' });
  } catch (err) {
    console.error('Error sending notification:', err);
    res.status(500).send({ Status: false, message: 'Failed to send notification' });
  }
};



