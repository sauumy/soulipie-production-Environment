const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    
    AstroSign_img:{
        type:String,
        set:(icon)=>{
        if(icon){
                    return icon  
                }
                return ;
            },
            default:" "// required: true   
    
    },
    AstroSign_name:{
        type: String,
        // required: true   
        default:" "
    }

},{ timestamps: true });

module.exports = mongoose.model('astrosign', userSchema, 'astrosign');

