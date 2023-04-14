const crypto = require('crypto');

class OtpService{
    generateOtp(){
        let otp = crypto.randomInt(1000,9999)
        console.log('otp',otp);
        return otp
    }
    hashData(data){
        const hash = crypto.createHmac('sha256',process.env.OTP_SECRET_KEY).update(data).digest('hex')
        return hash
    }
    passwordHash(password){
        const hash = crypto.createHmac('sha256',process.env.PASSWORD_SECRET_KEY).update(password).digest('hex')
        return hash
    }
}
module.exports = new OtpService()
