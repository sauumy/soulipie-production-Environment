const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const chatApplicationSchema=mongoose.Schema({
    sender_id:{
        type:Schema.Types.ObjectId,
        default:" "
    },
    other_id:{
        type:Schema.Types.ObjectId,
        default:" "
    },
    room_id:
    {
        type:String,
        require:true,
        unique:true
    },
    blocked: {
        type:Boolean,
        default:false
    }
},{ timestamps: true });
const chatModule=mongoose.model('chatModule',chatApplicationSchema);
module.exports={chatModule}