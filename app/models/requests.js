const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({

fromUser:{
    type:Schema.Types.ObjectId,
default:" "
},
toUser:{
    type:Schema.Types.ObjectId,
default:" "
},

requestPending:{
    type: Boolean, 
    default: false
},

});
module.exports = mongoose.model('requests', userSchema, 'requests');
