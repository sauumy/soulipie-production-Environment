const nodemailer = require('nodemailer')
//const TwoFactor = new (require('2factor'))(process.env.PINKBOX_APIKEY)
//const axios = require('axios').default;
var urlencode = require('urlencode');
const fetch = require('node-fetch')
const path=require('path')
var transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  auth: {
    user: "harishsoftwaresolutions.app@gmail.com",
    pass: "uufjxbpdgmrsrymx ",
  },
  
});
function mailoption(toemail,user_id,text,rating,recommendation,private,public){
var mail ={
  from: '"Soulipie Team" <harishsoftwaresolutions.app@gmail.com>',
  to: `${toemail}`,
  subject: "Received Feedback From User ",
  html:
 `<p>Find here user feedback details</p>
  <h4>User Experince: ${text}</h4>
  <h4>Rating: ${rating}</h4>
  <h4>Recommendation: ${recommendation}</h4>
  <h4>Private: ${private}</h4>
  <h4>Public: ${public}</h4>
`,        
}
return mail
}

const sendmail=async(toemail,user_id,text,rating,recommendation,private,public)=>{
try{

transporter.sendMail(mailoption(toemail,user_id,text,rating,recommendation,private,public),function(error,info){
if(error){

    console.log(error)
}else{
    console.log('email sent'+ info.response)
}

})
}catch(err){
console.log(err);
throw err
}    

}

      const sendOtpOnMobile = async (number,otp)=>{
        try{
          let sender = encodeURIComponent('PNKBOX');
          otp = String(otp)
          let msg = `${otp} is the OTP to Login to your Pink Box Account. This OTP is valid for 2 minutes only. DO NOT SHARE OTPs to anyone.`
          let encoded_message = encodeURIComponent(msg);
          console.log(sender,encoded_message);
          let apikey=urlencode('NTU1NTMwNTU2YzU3NDM3ODRjNzc1MDUyNDM1ODRhNTA=')
          let numbers=urlencode(number)
    
          data = 'username='+'pinkboxjewels@gmail.com'+'&password='+'PinkBox@123'+'&numbers='+numbers+"&sender="+sender+"&message="+encoded_message;
          //let result = await api.get('/send/?'+data)
          let result = await fetch('https://api.textlocal.in/send/?'+data, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          })
          let json = await result.json()
          if(json){
        return true
          }else{
       return false
          }
         }
        catch(err){
          throw err
        }
      }

  
  



module.exports = {sendmail,sendOtpOnMobile}


