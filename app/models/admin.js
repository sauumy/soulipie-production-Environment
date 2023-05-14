
const mongoose =require('mongoose')
const Schema=mongoose.Schema
const userSchema = new Schema  ({
    user_name:{
        type:String,
        default:""
    },
    password:{
        type:String,
        default:""
    
    }
},{timestamps:true});
module.exports = mongoose.model('admin', userSchema, 'admin');

