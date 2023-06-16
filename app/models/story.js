const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    sender_id:{
        type:Schema.Types.ObjectId,
        default:''
    },

    pic:{
        type:String,
           set:(icon)=>{
            if(icon){
                return icon  
            }
            return ;
        },
    },
    text:{
        type:String,
        default:''
    },
   video:{
    type:String,
    default:""
   },
    viewers:{
        type:Array,
        default:[]
    },
    totalViewers:{
        type:Number,
        default:''
    },
    deleteTime:{
        type:Date,
        index: { expireAfterSeconds: 0 }
    },
    duration:{
        type:Number,
        default:''
    }
 
},{timestamps:true})

module.exports = mongoose.model('story', userSchema, 'story');

