const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    userId:{
        type:Schema.Types.ObjectId
    },
    online:{
        type: Boolean,
        default:false
    },
    Offline:{
        type: Boolean,
        default:false
    },
    time:{
        type: String,
        default:' '
    }
},{ timestamps: true })

module.exports = mongoose.model('onlineoffline', userSchema, 'onlineoffline');

