const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
user_id:{
    type:Schema.Types.ObjectId,
    default:" "
},
request:{
    type:Array,
    default:""
},
accpeted:{
    type:Array,
    default:""
},
likespost:{
    type:Array,
    default:""
},
likecomment:{
    type:Array,
    default:""
},
taggedppl:{
    type:Array,
    default:""
}

});

module.exports = mongoose.model('notification', userSchema, 'notification');

