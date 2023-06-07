const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    post_owner:{
        type:Schema.Types.ObjectId
    },
post_id:{
    type:Schema.Types.ObjectId,
    default:" "
},
blocker_id:{
    type:Schema.Types.ObjectId,
    default:" "
},
blocking_reason:{
type:String,
default:''
}
},{ timestamps: true });
module.exports = mongoose.model('blockpost', userSchema, 'blockpost');
