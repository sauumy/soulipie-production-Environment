const express = require('express')
const route = express.Router();


const registrationController = require('../controllers/registration')
const {uploadProfile,compressProfileImg}=require('../middleware/uploadprofile')
const {uploadHobbies,compressHobbiesImg}=require('../middleware/uploadhobbies')
const {uploadAstro,compressedAstroImg}=require('../middleware/uploadastro')
const {uploadPosts,compressPOstsImg}=require('../middleware/uploadposts')
const {uploadVideo,compressGalleryVideo}=require('../middleware/uploadvideo')
const {upload1,compressGalleryImages}=require('../middleware/uploadimage')
const uploadAuido=require('../middleware/uploadaudio')
const{uploadVideoStory,compressVideoStroy}=require('../middleware/uploadstoryvideo')
const {uploadimagestory,compressedImgstory}=require('../middleware/uploadstoryimage')




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
route.get('/getprofile/:_id',profileController.getProfile)
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





route.get('/getConnections/:_id',chatModulecontrollers.getConnections)
route.post('/createChat',chatModulecontrollers.createChat)
route.post('/Message',chatModulecontrollers.Message)
route.post('/image',upload1.array('gallery'),compressGalleryImages,chatModulecontrollers.image)
route.post('/video',uploadVideo.array('gallery'),compressGalleryVideo,chatModulecontrollers.video)
route.post('/audio',uploadAuido.single('audio'),chatModulecontrollers.audio)
route.delete('/deleteOneManyMesage',chatModulecontrollers.deleteOneManyMesage)
route.delete('/deleteChat/:roomid',chatModulecontrollers.deleteChat)
route.get('/getmessage/:room_id',chatModulecontrollers.getmessage)
route.delete('/clearChat/:roomid',chatModulecontrollers.clearChat)
route.post('/messageHistory',chatModulecontrollers.messageHistory)

route.post('/addstoryImage',uploadimagestory.array('story_img'),compressedImgstory,storyController.addstoryImage)
route.post('/addstoryVideo',uploadVideoStory.array('story_video'),compressVideoStroy,storyController.addstoryVideo)
route.get('/getstory',storyController.getstory)
route.get('/getAllStory',storyController.getAllStory)
route.post('/updateViewers',storyController.updateViewers)
route.delete('/deleteStory',storyController.deleteStory)



route.post('/getBlockContact',settingsController.getBlockContact)
route.put('/unBlockContact',settingsController.unBlockContact)
route.put('/blockContact',settingsController.blockContact)


module.exports = route;



