var jwt = require('jsonwebtoken');
const Refresh = require('../models/refresh-model')
const accessTokenSecret = process.env.JWT_ACCESS_TOKEN_SECRET;
const refresTokenSecret = process.env.JWT_REFRESh_TOKEN_SECRET;


class JwtService{
    generateJwtToken(payload){
        const Authorization  = jwt.sign(payload,accessTokenSecret)
       // const refreshToken = jwt.sign(payload,refresTokenSecret,{expiresIn:'1y'})
        return Authorization
    }
   //Generate Jwt token START
    genrateToken(payload){
        // let secret = process.env.LINK_SECRET_KEY
        return jwt.sign(payload,refresTokenSecret,{expiresIn:'5m'})
    }
    //Generate Jwt token END
    
    //Store Refresh Token START
    async storeRefreshToken(refreshToken,user_id){
        try{
            await Refresh.create({
                token:refreshToken,
                user_id:user_id
            })
        }catch(err){
            console.log('storerefresherr',err);
            throw err
        }
    }
    //Store Refresh Token END

    //Find Refresh Token START
    async findRefreshToken(user_id){
        try{
            const data = await Refresh.findOne({user_id:user_id})
            if(data){
                let {token} = data
                return {Status:true,Token:token}
            }
            else{
                return {Status:false}
            }
        }catch(err){
            console.log('findRefreshtoken err ',err);
            throw err
        }
    }
    //Find Refresh Token END

    //verifyToken START
    verifyToken(token){
        try{
            const data = jwt.verify(token,refresTokenSecret);
	    console.log('jwt token',data)
            if(data){
		console.log("shiv")
                return {Status:true,data:data}
            }else{
                return {Status:false}
            }
        }
        catch(err){
            console.log('verifytoken err ',err);
            throw err
        }
    }
    //verifyToken END
    //Update Refresh Token START    
    async updateRefreshToken(user_id,token){
        try{
            await Refresh.findOneAndUpdate({user_id:user_id},{$set:{token:token}})
        }catch(err){
            console.log('updaterefreshtoken err',err);
            throw err
        }
    }
    //Update Refresh Token END

    //Verify AccessToken START
    verifyAccessToken(token){
        return jwt.verify(token,accessTokenSecret);
       
    }
    //Verify AccessToken END 

}

module.exports = new JwtService()
