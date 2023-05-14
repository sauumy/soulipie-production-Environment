const mongoose=require('mongoose')
const Schema = mongoose.Schema;
const storeMsgSchema=mongoose.Schema({
    sender_id:{
    type:Schema.Types.ObjectId,
   
        required:true
    },
    senderName:{
       type:String,
       required:"pls Enter name"
    },
    message:{
        type:String,
        
    },
    image:{
	type:String,
	default:''
	  },
   video:{
	type:String,
	default:''
	},
   audio:{
        type:String,
	default:''
	},
    room_id:{
        type:String,
        required:true
    }
},{ timestamps: true });

module.exports=mongoose.model('storeMsg',storeMsgSchema)
