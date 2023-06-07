
const tokenService = require('./app/services/jwt-service')
const Refresh = require('./app/models/refresh-model') 

const VerifyJwtToken = async(req,res,next)=>{
    try{
        
        const accessToken = req.headers['authorization'].split(' ')[1]
        if(!accessToken){
            console.log("accessToken",accessToken);
            throw new Error();
        }
        let account = await Refresh.findOne({token:accessToken})
        
        if(!account){
            return res.status(401).json({Status:false,message:'You are Logout Please Login'})
        }else{
            const userData = tokenService.verifyAccessToken(accessToken)
            

            if(!userData){
                throw new Error();
            }else{
                if(userData.LoggedIn===true)
                {
                    req.userData = userData
                    next()
                }else{
                    return res.status(401).json({Status:false,message:'You are Logout Please Login'})
                }
            }
        }
    }catch(err){
        if (err.message === 'jwt expired') {
	    console.log(err.message)
            return res.status(408).json({Status:false,message:'Token expired'})
        }
        return res.status(401).json({message:'Invalid token'})
    }
}

module.exports = VerifyJwtToken
