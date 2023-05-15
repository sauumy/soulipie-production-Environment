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





//const connectionController=require('../controlle')
const profileController=require('../controllers/profile')
const postsController=require('../controllers/posts');
const chatModulecontrollers= require('../controllers/chatmodule');
const storyController=require('../controllers/story')
const settingsController=require('../controllers/settings')
//route.post('/uploadqrimage',qrimageupload.single('image'),registrationController.qrImage)





route.post('/registration',registrationController.registration);
route.post('/loginViaOtp',registrationController.loginViaOtp);
route.post('/otpVerify',registrationController.otpVerify);
route.put('/createprofile',uploadProfile.single('profile_img'),compressProfileImg,profileController.createProfile)
route.put('/updateprofile',uploadProfile.single('profile_img'),compressProfileImg,profileController.updateProfile)
route.get('/getProfile/:_id',profileController.getProfile)
// route.put('/createProfileImage',uploadProfile.single('profile_img'),compressProfileImg,profileController.createProfileImage)
// route.put('/updateProfileImage',uploadProfile.single('profile_img'),compressProfileImg,profileController.updateprofileImage)
route.post('/addAstroSign',uploadAstro.single('astro_img'),compressedAstroImg,profileController.addAstroSign)
route.post('/addHobbies',uploadHobbies.single('hobi_img'),compressHobbiesImg,profileController.addHobbies)
route.post('/getOtherprofile',profileController.getOtherprofile)
route.get('/getAstroSign',profileController.getAstroSign)
route.get('/getHobbies',profileController.getHobbies)
route.get('/getAllProfile',profileController.getAllProfile)
route.post('/callerid',registrationController.callID);

route.post('/createpost',uploadPosts.array('post'),compressPOstsImg,postsController.createPost)
route.post('/getAllPostsofMe',postsController.getAllPostsofMe)

route.post('/getPostsOfAll',postsController.getPostsOfAll)
//route.post('/sendNotification',registrationController.sendNotification)


route.post('/sendrequest',registrationController.sendRequest)
route.post('/acceptrequest',registrationController.acceptRequest)
route.get('/requestCount/:_id',registrationController.requestCount)
route.get('/getRequest/:_id',registrationController.getRequest)
route.get('/getNotification/:_id',registrationController.getNotification)





route.post('/getConnections',chatModulecontrollers.getConnections)
route.post('/createChat',chatModulecontrollers.createChat)
route.post('/Message',registrationController.Message)
route.post('/image',upload1.array('gallery'),compressGalleryImages,registrationController.image)
route.post('/video',uploadVideo.array('gallery'),compressGalleryVideo,registrationController.video)
//route.post('/audio',uploadAudioToS3.single('audio'),uploadAudioToS3Bucket,chatModulecontrollers.audio)
route.post('/audio', uploadAudioToS3.single('audio'),uploadAudioToS3Bucket,registrationController.audio);
route.delete('/deleteOneManyMesage',chatModulecontrollers.deleteOneManyMesage)
route.delete('/deleteChat/:roomid',chatModulecontrollers.deleteChat)
route.get('/getmessage/:room_id',chatModulecontrollers.getmessage)
route.delete('/clearChat/:roomid',chatModulecontrollers.clearChat)
route.post('/messageHistory',chatModulecontrollers.messageHistory)

route.post('/addstoryImage',uploadimagestory.array('story_img'),compressedImgstory,storyController.addstoryImage)
route.post('/addstoryVideo',uploadVideoStory.array('story_video'),compressVideoStroy,storyController.addstoryVideo)
route.post('/getstory',storyController.getstory)
route.post('/getAllStory',storyController.getAllStory)
route.post('/updateViewers',storyController.updateViewers)
route.delete('/deleteStory',storyController.deleteStory)



route.post('/getBlockContact',settingsController.getBlockContact)
route.put('/unBlockContact',settingsController.unBlockContact)
route.put('/blockContact',settingsController.blockContact)

route.delete('/deletePost',postsController.deletePost)
route.post('/savePost',profileController.savePost)
route.get('/getSavedPost/:_id',profileController.getSavedPost)
route.post('/likePost',registrationController.likePost)
route.post('/getLikesOfPost',registrationController.getLikesOfPost)
route.post('/addComment',registrationController.addComment)
route.post('/likeComment',registrationController.likeComment)
route.post('/getComment',registrationController.getComment)
route.delete('/deleteComment',registrationController.deleteComment)
route.post('/addReplyComment',registrationController.addReplyComment)
route.post('/replyCommentlike',registrationController.replyCommentlike)
route.post('/explore',profileController.explore)

route.post('/reportUser',chatModulecontrollers.reportUser)
route.post('/rejectRequest',registrationController.rejectRequest)
route.post('/viewpost',postsController.viewpost)
route.post('/editPost',postsController.editPost)
route.post('/reportPost',postsController.reportPost)
route.post('/rejectExplore',profileController.rejectExplore)
route.post('/dissconnect',profileController.dissconnect)
route.post('/changeNumberverify',settingsController.changeNumberverify)
route.post('/changeNumber',settingsController.chaneNumber)
route.post('/securitySetting',settingsController.securitySetting)
route.post('/deeplink',registrationController.deeplink);

//adminloginstarts here

const admincontroller=require('../controllers/admin')
route.post('/adminlogin',admincontroller.adminlogin)
route.get('/newusers',admincontroller.newusers)
route.get('/totalusers',admincontroller.totalusers)
route.get('/matchesofUsers',admincontroller.matchesofUsers)
route.get('/connectionsOfAll',admincontroller.connectionsOfAll)
route.get('/postOfOfAll',admincontroller.postOfOfAll)
route.get('/bookMarksOfAll',admincontroller.bookMarksOfAll)
route.get('/reportsOfAll',admincontroller.reportsOfAll)
route.get('/requestsOfAll',admincontroller.requestsOfAll)
route.get('/postYouHaveLiked',admincontroller.postYouHaveLiked)
route.get('/totalPrivateAccount',admincontroller.totalPrivateAccount)
route.get('/totalConnectedAccount',admincontroller.totalConnectedAccount)
route.get('/totalPublicAccount',admincontroller.totalPublicAccount)
route.post('/connectedppltotag',postsController.connectedppltotag)

route.post('/sendNotification',registrationController.sendNotification)
//route.post('/checkToken',registrationController.checkToken)
module.exports = route;

