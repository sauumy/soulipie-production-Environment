const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
post_id:{
    type:Schema.Types.ObjectId,
    ref: 'posts'
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
defualt:" "
},
},{ timestamps: true });
module.exports =mongoose.model('comments', userSchema, 'comments');
