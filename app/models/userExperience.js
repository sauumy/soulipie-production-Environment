const mongoose =require('mongoose')

const experienceschema=mongoose.Schema({
    user_id:{
        type:String, 
    },
    rating:
    {
        type:Number, 
    },
    text:
    {
        type:String,
    },
    recommendation:{
        type:String
    },
    private:{
        type:Boolean,
        default:false
    },
    public:{
        type:Boolean,
        default:false
    }
},{ timestamps: true });
const Experience=mongoose.model('userExperience',experienceschema);
module.exports={Experience}