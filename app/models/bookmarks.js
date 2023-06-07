const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({

user_id:{
    type:Object,
    default:" "
},
saved:{
    type:Object,
   default:''
}
},{ timestamps: true });
module.exports = mongoose.model('bookmarks', userSchema, 'bookmarks');
