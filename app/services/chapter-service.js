
const Users = require('../models/registration');
 
class studyMaterialServie{


 


    async findByMobileNumber(mobilenumber,email){
        try{
             const data = await Users.findOne({mobilenumber:mobilenumber})
             if(data){
               return data;
             }
             else{
               return false;
             }
        }catch(err){
           console.log('service error',err);
           throw err
        }
      }
    
      async findAccount(email){
        try{
             const data = await Users.findOne({email:email})
             if(data){
               return data;
             }
             else{
               return false;
             }
        }catch(err){
           console.log('service error',err);
           throw err
        }
   }
   

}
module.exports = new studyMaterialServie()
