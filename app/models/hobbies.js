const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    
    Hobbies_img:{
        type:String,
        set:(icon)=>{
        if(icon){
                    return icon  
                }
                return ;
            },
            default:" "   
    
    },
    Hobbies_name:{
        type: Object,
        
        default:" "
    }

},{ timestamps: true });

module.exports = mongoose.model('hobbies', userSchema, 'hobbies');
