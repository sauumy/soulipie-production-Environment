const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        valid:true
    },
    mobilenumber: {
        type: Number,
        valid:true,
        max:10000000000,
        default:" "
    },
    name:{
        type:String,
        default:" "
    },
    email: {
        type: String,
        default:" "
    },
    profile_img: {
        type:String,
        set:(icon)=>{
        if(icon){
                    return icon  
                }
                return ;
            },
            default:" "
    },
    dob: {
        type: String,
       // required: true
       default:" "
    },
    occupation: {
        type: String,
       // required: true
       default:" "
    },
    location:{
            type: String,
            //required: true
            default:" "
    },
    gender:{
        type: String,
       // required: true   
       default:" " 
    },
    addprounous:{
        type: String,
        // required: true   
        default:" "
    },
    bio:{
        type: String,
        // required: true   
        default:" "
    },
    
    AstroSign:{
        type: String,
        // required: true   
        default:" "
    },
    Hobbies:{
        type: [String],
        // required: true   
        default:" "
    },
    token:{
        type:String,
        default:''
    },
    otp:{
        type:String,
        default:'false'
    },
    profile:{
        type:String,
        default:'false'
    },
    blockContact:{
        type:Array,
        default:[]
      },
isActive:{
type:Number,
default:0
}
    
});

module.exports = mongoose.model('usermaster', userSchema, 'usermasters');

