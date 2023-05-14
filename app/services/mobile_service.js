const nodemailer = require('nodemailer')
//const TwoFactor = new (require('2factor'))(process.env.PINKBOX_APIKEY)
//const axios = require('axios').default;
var urlencode = require('urlencode');
const fetch = require('node-fetch')
const path=require('path')
var transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  auth: {
    user: "hiyaak123@gmail.com",
    pass: "woofqpsirjtiufpf ",
  },
  
});
function mailoption(toemail,otp){
var mail ={
  from: '"Soulipie Team" <hiyaak123@gmail.com>',
  to: `${toemail}`,
  subject: "Received OTP From Soulipie ",
  html:
  "<h3>Dear" +
        "  " +
        "User," +
        
        "</h3>" +
        `<h4><h3>${otp}</h3>Find here your otp to login Soulipie, For security purpose do not share this with anyone</h4>`
        +
        "<p> Note:-This is your one Time Password, please dont share it with anyone</p>",        
}
console.log(otp)
return mail
}

const sendmail=async(toemail,otp)=>{
try{

transporter.sendMail(mailoption(toemail,otp),function(error,info){
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


