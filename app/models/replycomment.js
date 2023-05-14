const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
post_id:{
    type:Schema.Types.ObjectId,
    default:" "
},
comment_id:{
    type:Schema.Types.ObjectId,
    default:" "
},
text:{
type:String,
default:''
},
commentdetails:{
type:Object,
default:''
},
commentlikerDetails:{
type:Array,
default:[]
},
totallikesofcomments:{
type:Number,
defualt:0
},
},{ timestamps: true });
module.exports= mongoose.model('commentreply', userSchema, 'commentreply');
 