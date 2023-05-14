const mongoose = require('mongoose');
const { replyCommentlike } = require('../controllers/registration');

const Schema = mongoose.Schema;

const userSchema = new Schema({
user_id:{
    type:Schema.Types.ObjectId,
    default:" "
},
request:{
    type:Object,
    default:""
},
accpeted:{
    type:Object,
},
likespost:{
    type:Object,
},
likecomment:{
    type:Object,
},
taggedppl:{
    type:Object,
},
comment:{
    type:Object,
},
mentioned:{
    type:Object,
},
replyCommentlike:{
    type:Object,
},
replyComment:{
    type:Object,
}
},{ timestamps: true });

module.exports = mongoose.model('notification', userSchema, 'notification');

