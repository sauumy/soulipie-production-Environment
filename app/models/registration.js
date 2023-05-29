const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        unique:true
    },
    mobilenumber: {
        type: Number,
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
    private:{
    type:Boolean,
    default:false
    },   
        public:{
        type:Boolean,
        default:true
        
        },
        connected:{
            type:Boolean,
            default:false
           
            }
},{ timestamps: true });

module.exports = mongoose.model('usermaster', userSchema, 'usermasters');

