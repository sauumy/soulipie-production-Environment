const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
post_id:{
    type:Schema.Types.ObjectId,
    default:" "
},
reporter_id:{
    type:Schema.Types.ObjectId,
    default:" "
},
reportreason:{
type:String,
default:''
}
},{ timestamps: true });
module.exports = mongoose.model('reportpost', userSchema, 'reportpost');
