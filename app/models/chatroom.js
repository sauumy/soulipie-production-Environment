const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const chatApplicationSchema=mongoose.Schema({
    sender_id:{
        type:Schema.Types.ObjectId,
        default:" "
    },
    room_id:{
        type:String,
        default:" "
    },
    isChatroom:{
        type:Boolean,
        default:false
    }
},{ timestamps: true });
const isRoom=mongoose.model('chatroom',chatApplicationSchema);
module.exports={isRoom}