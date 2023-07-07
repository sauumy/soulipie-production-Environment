const express = require('express')
const route = express.Router();
const registrationController = require('../controllers/registration')
const  { uploadProfile, compressProfileImg }=require('../middleware/uploadprofile')
const{uploadHobbies,compressHobbiesImg}=require('../middleware/uploadhobbies')
const {uploadAstro,compressedAstroImg}=require('../middleware/uploadastro')
const {uploadPosts,compressPOstsImg}=require('../middleware/uploadposts')
const {uploadVideo,compressGalleryVideo}=require('../middleware/uploadvideo')
const {upload1,compressGalleryImages} = require('../middleware/uploadimage');
const{uploadVideoStory,compressVideoStroy}=require('../middleware/uploadstoryvideo')
const {uploadimagestory,compressedImgstory}=require('../middleware/uploadstoryimage')
const {uploadAudioToS3,uploadAudioToS3Bucket}=require('../middleware/uploadaudio')
const profileController=require('../controllers/profile')
const postsController=require('../controllers/posts');
const chatModulecontrollers= require('../controllers/chatmodule');
const storyController=require('../controllers/story')
const settingsController=require('../controllers/settings')
const admincontroller=require('../controllers/admin');
const admin = require('../models/admin');

//healthcheck module
route.post('/healthcheck',registrationController.healthcheck)
//experienceodel
route.post('/userExperience',settingsController.userExperience)
route.post('/getUserExperience',settingsController.getUserExperience)

//share Module
route.post('/deeplink',registrationController.deeplink);

//explore Module
route.post('/rejectExplore',profileController.rejectExplore)
route.post('/explore',profileController.explore)
//notification Module
route.get('/getNotification/:_id',registrationController.getNotification)
route.post('/viewpost',postsController.viewpost)
//admin module
route.post('/adminlogin',admincontroller.adminlogin)
route.get('/newusers',admincontroller.newusers)
route.get('/totalusers',admincontroller.totalusers)
route.get('/matchesofUsers',admincontroller.matchesofUsers)
route.get('/connectionsOfAll',admincontroller.connectionsOfAll)
route.get('/postOfOfAll',admincontroller.postOfOfAll)
route.get('/bookMarksOfAll',admincontroller.bookMarksOfAll)
route.get('/reportsOfUser',admincontroller.reportsOfUser)
route.get('/requestsOfAll',admincontroller.requestsOfAll)
route.get('/postYouHaveLiked',admincontroller.postYouHaveLiked)
route.get('/totalPrivateAccount',admincontroller.totalPrivateAccount)
route.get('/totalConnectedAccount',admincontroller.totalConnectedAccount)
route.get('/totalPublicAccount',admincontroller.totalPublicAccount)
route.get('/reportOfPost',admincontroller.reportOfPost)
route.get('/feedBackOfAll',admincontroller.feedBackOfAll)
route.get('/blocks',admincontroller.blocks)
route.get('/postBlock',admincontroller.postBlock)

//loginModule
route.post('/registration',registrationController.registration);
route.post('/loginViaOtp',registrationController.loginViaOtp);
route.post('/otpVerify',registrationController.otpVerify);
route.post('/addAstroSign',uploadAstro.single('astro_img'),compressedAstroImg,profileController.addAstroSign)
route.post('/addHobbies',uploadHobbies.single('hobi_img'),compressHobbiesImg,profileController.addHobbies)
route.get('/getAstroSign',profileController.getAstroSign)
route.get('/getHobbies',profileController.getHobbies)

//profileModule
route.put('/createprofile',uploadProfile.single('profile_img'),compressProfileImg,profileController.createProfile)
route.put('/createProfile1',profileController.createProfile1)
route.get('/getProfile/:_id',profileController.getProfile)
route.post('/getOtherprofile',profileController.getOtherprofile)
route.get('/getAllProfile',profileController.getAllProfile)

//Community Module
route.post('/getPostsOfAll',postsController.getPostsOfAll)
route.post('/likePost',registrationController.likePost)
route.post('/getLikesOfPost',registrationController.getLikesOfPost)
route.post('/addComment',registrationController.addComment)
route.post('/likeComment',registrationController.likeComment)
route.post('/getComment',registrationController.getComment)
route.delete('/deleteComment',registrationController.deleteComment)
route.post('/addReplyComment',registrationController.addReplyComment)
route.post('/replyCommentlike',registrationController.replyCommentlike)
route.post('/reportPost',postsController.reportPost)
route.post('/bockPost',postsController.bockPost)
route.post('/feedback',postsController.feedback)
//storyModule
route.post('/addstoryImage',uploadimagestory.array('story_img'),compressedImgstory,storyController.addstoryImage)
route.post('/addstoryVideo',uploadVideoStory.array('story_video'),compressVideoStroy,storyController.addstoryVideo)
route.post('/getstory',storyController.getstory)
route.post('/getAllStory',storyController.getAllStory)
route.post('/getAllStory1',storyController.getAllStory1)
route.post('/updateViewers',storyController.updateViewers)
route.delete('/deleteStory',storyController.deleteStory)


//settingsModule
route.post('/getBlockContact',settingsController.getBlockContact)
route.put('/updateprofile',uploadProfile.single('profile_img'),compressProfileImg,profileController.updateProfile)
route.put('/unBlockContact',settingsController.unBlockContact)
route.put('/blockContact',settingsController.blockContact)
route.post('/changeNumberverify',settingsController.changeNumberverify)
route.post('/changeNumber',settingsController.chaneNumber)
route.post('/securitySetting',settingsController.securitySetting)
route.post('/online',settingsController.userlogin)
route.post('/offline',settingsController.userOffline)
route.post('/getuseronlineorofline',settingsController.getuseronlineorofline)

//bookmark Module
route.post('/savePost',profileController.savePost)
route.get('/getSavedPost/:_id',profileController.getSavedPost)

//chat Module
route.post('/getConnections',chatModulecontrollers.getConnections)
route.post('/createChat',chatModulecontrollers.createChat)
route.post('/Message',registrationController.Message)
route.post('/image',upload1.array('gallery'),compressGalleryImages,registrationController.image)
route.post('/video',uploadVideo.array('gallery'),compressGalleryVideo,registrationController.video)
route.post('/audio', uploadAudioToS3.single('audio'),uploadAudioToS3Bucket,registrationController.audio);
route.delete('/deleteOneManyMesage',chatModulecontrollers.deleteOneManyMesage)
route.delete('/deleteChat/:roomid',chatModulecontrollers.deleteChat)
route.get('/getmessage/:room_id',chatModulecontrollers.getmessage)
route.delete('/clearChat/:roomid',chatModulecontrollers.clearChat)
route.post('/messageHistory',chatModulecontrollers.messageHistory)
route.post('/reportUser',chatModulecontrollers.reportUser)
route.post('/callerid',registrationController.callID)
route.post('/isChatRoom',chatModulecontrollers.isChatRoom)
route.post('/isNotChatRoom',chatModulecontrollers.isNotChatRoom)
//otheruserModule
route.post('/sendrequest',registrationController.sendRequest)
route.post('/acceptrequest',registrationController.acceptRequest)
route.get('/requestCount/:_id',registrationController.requestCount)
route.get('/getRequest/:_id',registrationController.getRequest)
route.post('/dissconnect',profileController.dissconnect)
route.post('/rejectRequest',registrationController.rejectRequest)
route.post('/matchedList',profileController.matchedList)
//createpost
route.post('/connectedppltotag',postsController.connectedppltotag)
route.post('/createPostImg',uploadPosts.array('post'),compressPOstsImg,postsController.createPostImg)
route.post('/editPostImg',uploadProfile.single('post'),compressProfileImg,postsController.editPostImg)
route.delete('/deletePost',postsController.deletePost)
route.post('/getAllPostsofMe',postsController.getAllPostsofMe)
route.post('/editPostDetails',registrationController.editPostDetails)
//extra
route.post('/sendNotification',registrationController.sendNotification)
module.exports = route;

