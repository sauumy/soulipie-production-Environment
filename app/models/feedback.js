const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
feedback:{
    type:String,
    default:' '
},
feedback_id:{
    type:String,
    default:' '
}
    
},{ timestamps: true });
module.exports = mongoose.model('feedback', userSchema, 'feedback');
