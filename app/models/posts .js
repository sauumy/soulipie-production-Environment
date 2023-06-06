const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    user_id:{
        type:Schema.Types.ObjectId,
        default:" "
    },
    Post_img:{
        type:String,
        set:(icon)=>{
        if(icon){
                    return icon  
                }
                return ;
            },
            default:" "
    },
   Post_discription:{
    type:String,
    default:''
   },
   Tagged_people:{
    type:Array,
    default:[]
   },
   totallikesofpost:{
    type:Number,
    default:''
   },
   totalcomments:{
    type:Number,
    defualt:" "
    },
    likedpeopledata:{
        type:Array,
        defualt:" "
    },
    post_blocked:{
        type:Array,
        defualt:[ ]
    }

},{ timestamps: true });

module.exports = mongoose.model('posts', userSchema, 'posts');

