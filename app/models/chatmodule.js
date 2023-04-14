const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const chatApplicationSchema=mongoose.Schema({
    user_id:{
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
    }
},{ timestamps: true });
const chatModule=mongoose.model('chatModule',chatApplicationSchema);
module.exports={chatModule}