const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
UsersPost:{
        type:Array
    },
userPostThagged:{
    type:Array
},
postsuserLikedData:{
    type:Array
},
blocking_reason:{
    type:Array
}
},{ timestamps: true });
module.exports = mongoose.model('deletedData', userSchema, 'deletedData');
