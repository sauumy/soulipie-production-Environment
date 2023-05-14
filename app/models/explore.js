const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
user_id:{
    type: Schema.Types.ObjectId,
    default: null
},
matchedprofiles:{
type:Object,
default:''
},
connected:{
type:Boolean,
default:false
},
requested:{
    type:Boolean,
    default:false
    },
rejected:{
    type:Boolean,
    default:false
}
},{ timestamps: true });
module.exports = mongoose.model('explore', userSchema, 'explore');
