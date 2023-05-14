const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
post_id:{
    type:Schema.Types.ObjectId,
    default:" "
},
likesofposts:{
type:Array,
default:[]
},
totallikesofpost:{
    type:Number,
    default:0
}

},{ timestamps: true });
module.exports = mongoose.model('postlike', userSchema, 'postlike');
