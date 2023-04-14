const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
user_id:{
    type:Schema.Types.ObjectId,
    default:" "
},
connections:{
type:Array,
default:[]
},
totalrequest:{
    type:Array,
    default:[]
    }
});
module.exports = mongoose.model('connection', userSchema, 'connection');
