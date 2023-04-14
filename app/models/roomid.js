const mongoose =require('mongoose')

const videocallSchema=mongoose.Schema({
    host_id:{
        type:String,

        
    },
    joiner_id:
    {
        type:String,

        
    },
    callerId:
    {
        type:String,
        require:true,
        unique:true
    }
},{ timestamps: true });
const callerID=mongoose.model('callerID',videocallSchema);
module.exports={callerID}