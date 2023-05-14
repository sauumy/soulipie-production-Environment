const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
reporter_id:{
    type:Schema.Types.ObjectId,
    default:" "
},
report_id:{
    type:Schema.Types.ObjectId,
    default:" "
},
reportreason:{
type:String,
default:''
}
},{ timestamps: true });
module.exports = mongoose.model('report', userSchema, 'report');
