const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
user_id:{
    type:Schema.Types.ObjectId
},
request:{
    type:Object
},
accpeted:{
    type:Object,
},
post_id:{
    type:Schema.Types.ObjectId,
},
comment_id:{
    type:Schema.Types.ObjectId,
},
replycomment_id:{
    type:Schema.Types.ObjectId,
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

