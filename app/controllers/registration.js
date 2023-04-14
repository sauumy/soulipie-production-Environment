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
const serviceAccount = require('../../soulipie-9ac7d-firebase-adminsdk-mc3gh-81342bc60e.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://soulipie-9ac7d-default-rtdb.firebaseio.com"
  });

  const messaging = admin.messaging();

// exports.registration = async (req, res) => {
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
exports.loginViaOtp = async (req, res) => {             
    try{
        const {mobilenumber,email}=req.body
        if(mobilenumber){
            let account;
            account = await chaservice.findByMobileNumber(req.body.mobilenumber)
            if(!account){
                return res.status(406).send({Status:false,message:'not registered mobilenumber'})
        }
           else if(account){
            let mobilenumber;
            let otp = otpService.generateOtp(1000,9999)
                   mobilenumber = await service.sendOtpOnMobile(req.body.mobilenumber,otp)
                
                let time = 1000*60*5
                let expires = Date.now()+time
                let data = `${req.body.mobilenumber}.${otp}.${expires}`
                let result = otpService.hashData(data)
                if(mobilenumber===true){
                    return res.status(200).send({
                        Status:true,
                        message:'otp send sucessfully on mobile',
                        hashdata:`${result}.${expires}`,
                        otp,
                        mobilenumber:req.body.mobilenumber
                    })
                }
                }else{
                    return res.status(406).send({Status:false,message:'mobilenumber is not Valid'})
                }
    }else if(email){
        let account;
        account = await chaservice.findAccount(req.body.email)
        if(!account){
            return res.status(406).send({Status:false,message:'not registeres email'})
    }
        else if(account){
        let email;
        let otp = otpService.generateOtp(1000,9999)
               email = await service.sendmail(req.body.email,otp)
            
            let time = 1000*60*5
            let expires = Date.now()+time
            let data = `${req.body.email}.${otp}.${expires}`
            let result = otpService.hashData(data)
            
                return res.status(200).send({
                    Status:true,
                    message:'otp send sucessfully on mobile',
                    hashdata:`${result}.${expires}`,
                    otp,
                    email:req.body.email
                })
            
            }else{
                return res.status(406).send({Status:false,message:'mobilenumber is not Valid'})
            }
    }
}
   
    catch(err){
         console.log('LoginViaOtperror',err);
        return res.status(400).send({Status:'Error',message:'somthing went wrong'})
       }                    
 };

exports.otpVerify = async (req, res) => {
try{
    const {email,mobilenumber,hashdata,otp} = req.body
     if(mobilenumber){
        let account;
        if(isNaN(mobilenumber)){
            account = await chaservice.findAccount(req.body.mobilenumber)
        }
        else{
            account = await Users.findOne({mobilenumber:req.body.mobilenumber})
            console.log(account)
    if(!account){
            return res.status(406).send({Status:false,message:'This MobileNumber or email is not Exist'})
        }
        else{
        const [hash,expires] = hashdata.split('.')
        let data = `${mobilenumber}.${otp}.${expires}`
        if(Date.now()>expires){
            return res.status(406).send({Status:false,message:'Your OTP Session Expires'})
        }
        else{
            let result = otpService.hashData(data)
            let otpverify = await Users.findOneAndUpdate({mobilenumber:mobilenumber},{ $set:{otp:true}},{new :true}).exec();
            if(otpverify&&result===hash){
              let result = await Users.findOne({mobilenumber:req.body.mobilenumber})
                    const Authorization = jwtTokenService.generateJwtToken({user_id:account._id,LoggedIn:true})
                    await jwtTokenService.updateRefreshToken(account._id,Authorization)
                    return res.status(200).send({Status:true,message:'OTP Verify Successfully',result,Authorization})
                }
            
            else{
                return res.status(406).send({Status:false,message:'OTP Miss Match'})
            }
        }
    }
  }
}
else if (email){
    let account
  if(email){
      account = await Users.findOne({email:req.body.email})
      console.log(account)
if(!account){
      return res.status(406).send({Status:false,message:'This MobileNumber or email is not Exist'})
  }
    else{
    const [hash,expires] = hashdata.split('.')
    let data = `${email}.${otp}.${expires}`
    if(Date.now()>expires){
        return res.status(406).send({Status:false,message:'Your OTP Session Expires'})
    }
    else{
        let result = otpService.hashData(data)
        let otpverify = await Users.findOneAndUpdate({email:req.body.email},{ $set:{otp:true}},{new :true}).exec();
        if(otpverify&&result===hash){
          let result = await Users.findOne({email:req.body.email})
                const Authorization = jwtTokenService.generateJwtToken({user_id:account._id,LoggedIn:true})
                await jwtTokenService.updateRefreshToken(account._id,Authorization)
                return res.status(200).send({Status:true,message:'OTP Verify Successfully',result,Authorization})
            }
        
        else{
            return res.status(406).send({Status:false,message:'OTP Miss Match'})
        }
    }
}
}
}
}catch(err){
    console.log(err);
    return res.status(400).send({Status:'Error',message:'somthing went wrong'})
           }
}


exports.registration = async (req, res) => {
    try{  
        if(req.body.email){
            if(!req.body.email){
                return res.status(406).send({Status:false,message:'Email is required field'})
            }
            else{
            let account;
            account = await chaservice.findAccount(req.body.email)
            const otp=account.otp 
            const profile=account.profile
            if(otp=='true'&&profile=='false'){
              return res.status(406).send({Status:false,message:'otp Verified'})
            }
            else if(otp=='true'&&profile=='true'){
                return res.status(406).send({Status:false,message:'You have already registerd with souliepie please login'})
            }
            else if(!account){
        const user=new Users({
            email:req.body.email,
        });
      
        if(user)
            {
                const account1 = await user.save()
                account= account1 
                account = await chaservice.findAccount(req.body.email)
                const Authorization  = jwtTokenService.generateJwtToken({user_id:account._id,LoggedIn:true})
                await jwtTokenService.storeRefreshToken(Authorization,account._id)


                const account3 = await chaservice.findAccount(req.body.email);
          console.log(account3)
          const customToken = await admin.auth().createCustomToken('account3');
  
          await Users.updateOne({ email: req.body.email }, { token: customToken });
                                     
                                     let otp = Math.floor(1000 + Math.random() * 9000);
                                     const emails = await service.sendmail(req.body.email,otp)                  
                let time = 1000*60*5
                let expires = Date.now()+time
                let data = `${req.body.email}.${otp}.${expires}`
                let result = otpService.hashData(data)
                                    return res.status(200).send({
                                        Status:true,
                                        message:'otp send sucessfully on email',
                                        name:req.body.name,
                                        hashdata:`${result}.${expires}`,
                                        otp,
                                        email:req.body.email,
              
                                    })
                                    
                                }else{
                                    return res.status(400).send({Status:false,message:'account is not found',Error})
                                }
                            }else if(account){
                           const    user = await chaservice.findAccount(req.body.email)
                           const otpvalue=user.otp
                           console.log(otpvalue)
                           if(user&&otpvalue=='false'){
                
                account= user 
                account = await chaservice.findAccount(req.body.email)
                const Authorization  = jwtTokenService.generateJwtToken({user_id:account._id,LoggedIn:true})
                await jwtTokenService.storeRefreshToken(Authorization,account._id)
                                     let otp = Math.floor(1000 + Math.random() * 9000);
                                     const emails = await service.sendmail(req.body.email,otp)                  
                let time = 1000*60*5
                let expires = Date.now()+time
                let data = `${req.body.email}.${otp}.${expires}`
                let result = otpService.hashData(data)
                                    return res.status(200).send({
                                        Status:true,
                                        message:'otp send sucessfully on email',
                                        name:req.body.name,
                                        hashdata:`${result}.${expires}`,
                                        otp,
                                        email:req.body.email
                                    })
                                    
                                }else{
                                    return res.status(400).send({Status:false,message:'account is not found',Error})
                                }
                            }else{
                              return res.status(400).send({Status:false,message:'please check details',Error})
                            }
        }
    }
       else  if(req.body.mobilenumber){
      if(!req.body.mobilenumber){
            return res.status(406).send({Status:false,message:'Mobilenumber is required field'})
        }
        else {
            let account;
            account = await chaservice.findByMobileNumber(req.body.mobilenumber)
            const otp=account.otp 
            console.log(otp)
          
            const profile=account.profile
            console.log(profile)
            if(otp=='true'&&profile=='false'){
              return res.status(406).send({Status:false,message:'otp Verified'})
            }
            else if(otp=='true'&&profile=='true'){
                return res.status(406).send({Status:false,message:'You have already registerd with souliepie please login'})
            }
            else if (!account){
                const user=new Users({   
                    mobilenumber:req.body.mobilenumber,
                          })
                            const account1 = await user.save()
                        
                            if(user){
                            account= account1 
                            account = await chaservice.findByMobileNumber(req.body.mobilenumber)
                            const Authorization  = jwtTokenService.generateJwtToken({user_id:account._id,LoggedIn:true})
                            await jwtTokenService.storeRefreshToken(Authorization,account._id)

                            const account3 = await chaservice.findByMobileNumber(req.body.mobilenumber);
                            console.log(account3)
                            const customToken = await admin.auth().createCustomToken('account3');
                    
                            await Users.updateOne({ mobilenumber: req.body.mobilenumber }, { token: customToken });
                             
                             
            
                            
        let mobilenumber;
            let otp = otpService.generateOtp(1000,9999)
            
                   mobilenumber = await service.sendOtpOnMobile(req.body.mobilenumber,otp)
                
                let time = 1000*60*5
                let expires = Date.now()+time
                let data = `${req.body.mobilenumber}.${otp}.${expires}`
                let result = otpService.hashData(data)
                if(mobilenumber===true){
                    return res.status(200).send({
                        Status:true,
                        message:'otp send sucessfully on mobilenumber',
                        name:req.body.name,
                        hashdata:`${result}.${expires}`,
                        otp,
                        mobilenumber:req.body.mobilenumber,
                        
                    })
                }
                }
                else{
                    return res.status(406).send({Status:false,message:'name ormobilenumber is not Valid'})
                }
           
            }     else if (account){
              const    user = await chaservice.findByMobileNumber(req.body.mobilenumber)
              const otpvalue=user.otp
              console.log(otpvalue)
              if(user&&otpvalue=='false'){
                account= user 
                account = await chaservice.findByMobileNumber(req.body.mobilenumber)
                const Authorization  = jwtTokenService.generateJwtToken({user_id:account._id,LoggedIn:true})
                await jwtTokenService.storeRefreshToken(Authorization,account._id)
                 

                
let mobilenumber;
let otp = otpService.generateOtp(1000,9999)

       mobilenumber = await service.sendOtpOnMobile(req.body.mobilenumber,otp)
    
    let time = 1000*60*5
    let expires = Date.now()+time
    let data = `${req.body.mobilenumber}.${otp}.${expires}`
    let result = otpService.hashData(data)
    if(mobilenumber===true){
        return res.status(200).send({
            Status:true,
            message:'otp send sucessfully on mobilenumber',
            name:req.body.name,
            hashdata:`${result}.${expires}`,
            otp,
            mobilenumber:req.body.mobilenumber,
            
        })
    }
    }
    else{
        return res.status(406).send({Status:false,message:'mobilenumber is not Valid'})
    }

            }else{
              return res.status(400).send({Status:false,message:'please check details',Error})
            }
    }
    }

 
 } catch(err){
         console.log('registrtion error',err);
        return res.status(400).send({Status:'Error',message:'somthing went wrong'})
       }                    
 };


//  exports.sendNotification = async (req, res) => {
//     try {
//       const { token } = req.body;
//       const notification = {
//         title: 'hi',
//         body: 'hlo',
//       };
  
//       const data = {
//         foo: 'bar',
//       };
  
//       const response = await messaging.sendToDevice(token, { notification, data });
  
//       console.log('Notification sent:', response);
  
//       res.status(200).send({ Status: true, message: 'Notification sent successfully' });
//     } catch (err) {
//       console.error('Error sending notification:', err);
//       res.status(500).send({ Status: false, message: 'Failed to send notification' });
//     }
//   }
  

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
        await follower.save();
          if(follower){
        const sender = await Users.findOne({ _id: fromUser },{_id:1,profile_img:1,token:1,name:1});
        const token = sender.token;
        
        const profile_img=sender.profile_img
        const name=sender.name
        console.log(name)
      const touser=await users.findOne({user_id:toUser})
      if(touser){
        const update=await users.findOneAndUpdate({user_id:toUser},{$push:{totalrequest:sender}})
        
        if(update){
          const notification = {
              title: 'Soulipie',
              body: `${name} would like to connect with you.`,
              icon: profile_img,
            };
            const tousers=await notifications.findOne({user_id:toUser})
            if(tousers){
              await notifications.updateOne({user_id:toUser},{$push:{request:notification}})
            }else {
              const noti=new notifications({
                user_id:toUser,
                request:notification
              })
              await noti.save()
            }
          await admin.messaging().sendToDevice(token,{notification});
          return res.status(200).json({status:true, message: 'Connection request sent successfully',notification});
        }
      }
      else{
        const user=new users({
          user_id:toUser,
          totalrequest:sender
        })
        const data=await user.save()
      
          if(data){
        const notification = {
            title: 'Soulipie',
            body: `${name} would like to connect with you.`,
            icon: profile_img,
          }
          const tousers=await notifications.findOne({user_id:toUser})
          if(tousers){
            await notifications.updateOne({user_id:toUser},{$push:{request:notification}})
          }else {
            const noti=new notifications({
              user_id:toUser,
              request:notification
            })
            await noti.save()
          }
        await admin.messaging().sendToDevice(token,{notification});
        return res.status(200).json({status:true, message: 'Connection request sent successfully',notification});
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
        const token = receiver.token;
        const sender = await Users.findOne({ _id: fromUser },{_id:1,profile_img:1,token:1,name:1});
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
                const fromuser=await notifications.findOne({user_id:fromUser})
                if(fromuser){
                  await notifications.updateOne({user_id:fromUser},{$push:{accpeted:notification}})
                }else {
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
      return res.status(200).json({status:true ,message: `wait we load notification`,response});
    }else{
      return res.status(400).json({ status:false,message: 'Coulnt load notification' });
    }
  }catch (error) {
        console.log(error);
        return res.status(500).json({status:false, message: 'Internal server error.' });
      }
}