
const story = require ('../models/story')
const usermaster=require('../models/registration')
const connectSchema=require('../models/connection')
const mongoose=require('mongoose')

exports.addstoryImage = async (req, res) => {
    try{
        
        if (req.files && req.files.length > 0) {
            const pic = req.files.map(file => file.filename);
            const sender_id = req.body.sender_id;
            const text = req.body.text;
            const currenttime=new Date()
           currenttime.setHours(currenttime.getHours() + 24) 
           const storyDocs = pic.map(p => new story({
              sender_id,
              text,
              pic: p,
              deleteTime:currenttime
            }));
            const result = await story.insertMany(storyDocs);
            return res.status(200).json({Status:true,message:"story created successfully",result})
            }
    
        else{
            return res.status(406).json({Status:false,message:"Please choose img"})
        }
     }catch(err){
        console.log('err',err.message);
        const Error={}
        if(err.message.includes(' validation failed')){
            Object.values(err.errors).forEach(properties=>{
                    Error[properties.path]=properties.message
            })
        }
        return res.status(400).json({Status:'Error',Error})
     } 
};
exports.addstoryVideo = async (req, res) => {
    try{
       
        if (req.files && req.files.length > 0) {
            const video = req.files.map(file => file.filename);
            const sender_id = req.body.sender_id;
            const text = req.body.text;
            const currenttime=new Date()
            currenttime.setHours(currenttime.getHours()+24)
            const storyDocs = video.map(v => new story({
              sender_id,
              text,
              video: v,
              deleteTime:currenttime
            }));
            const result = await story.insertMany(storyDocs);
            return res.status(200).json({Status:true,message:"story created successfully",result})
        }
        else{
            return res.status(406).json({Status:false,message:"Please choose img"})
        }
     }catch(err){
        console.log('err',err.message);
        const Error={}
        if(err.message.includes(' validation failed')){
            Object.values(err.errors).forEach(properties=>{
                    Error[properties.path]=properties.message
            })
        }
        return res.status(400).json({Status:'Error',Error})
     } 
};
exports.getstory = async (req, res) => {
    try {
        const{sender_id}=req.body
        const user = await story.find({sender_id:sender_id});
        res.status(200).send({Status:true,message:"story fetched successfully",user});
    } catch(error) {
        res.status(404).json({ message: error.message});
    }
};
// exports.getAllStory=async(req,res)=>{
//     try{

//         const user = await story.find({},{_id:1,sender_id:1,pic:1,text:1,viewers:1,video:1,totalViewers:1,deleteTime:1});
// const ids=user.map(doc => doc.sender_id);
// const name=await usermaster.find({_id:{$in:ids}},{_id:0,name:1})
//         res.status(200).send({Status:true,message:"story fethed successfully",user});

//     }catch(error) {
//         res.status(404).json({ message: error.message});
//     }
// }
// exports.updateViewers = async(req,res) =>{
//     try{
//        const {seenuser_id,_id} = req.body
//        console.log(seenuser_id,_id);
//        if(!_id || !seenuser_id){
//            return res.status(406).json({message:'user_id and status_id are required field'})
//        }else{
//           const status= await story.findOne({_id:_id})
//           const user_id=status.sender_id
//           console.log(user_id)
     
//         if(status){
            
//            const response = await story.updateOne(
//             { _id: _id },
//             {
//               $push: { viewers: { $each: seenuser_id } }
//             }
//           );
//             const numbers=response.viewers
//             if(response){
//                 const respond=await story.findOne({_id:_id})
//                 const count = respond.viewers;

//                 const uniqueViewers = new Set(count);
//                 const totalcount = uniqueViewers.size;
//                 console.log(totalcount);
//                 const counts = count.reduce((acc, curr) => {
//                     acc[curr] ? acc[curr]++ : (acc[curr] = 1);
//                     return acc;
//                   }, {});
//                   console.log(counts);
//                const totalviewers=await story.findOneAndUpdate({_id:_id},{totalViewers:totalcount})
//                console.log(totalcount,totalviewers)
//                if(totalcount,totalviewers){
//                const resul=await story.findOne({_id:_id})
                
//                 const data=await usermaster.find({_id:numbers},{_id:1,profile_img:1,name:1})
//                 console.log(data)
//                 const result = {
//                     ...resul.toObject(),
//                     viwerDetails: data.map(d => d.toObject())
//                   };
                  
//                   console.log(result);
              
//               console.log(result);
//                 return res.status(200).json({Status:true,message:"story fetched  successfully",result})
//                }else{
//                 return res.status(406).json({message:'no views yet'})
//                }
//             }else{
//                 return res.status(406).json({message:'error while updating the view'})
//             }
//         }else{
//             return res.status(406).json({message:'error while updating the views'})
//            }
//     }
   
// }catch(err){
//         console.log(err);
//         return res.status(400).json({message:"somthing went wrong"})
//     }
// }
exports.deleteStory=async(req,res)=>{
    try{
        const {_id}=req.body
        const user = await story.findOneAndDelete({_id:_id});
        res.status(200).send({Status:true,message:"story deleted successfully",user});

    }catch(error) {
        res.status(404).json({ message: error.message});
    }
}
exports.updateViewers = async(req,res) =>{
    try {
      const { seenuser_id, _id } = req.body;
      
      if (!_id || !seenuser_id) {
        return res.status(406).json({ message: 'user_id and status_id are required field' });
      } else {
        const status = await story.findOne({ _id: _id });
        const user_id = status.sender_id.toString();
       
        if (status) {
          if (!seenuser_id.includes(user_id)) {
            const response = await story.findOneAndUpdate(
              { _id: _id },
              {
                $push: { viewers: { $each: seenuser_id } }
              }
            );
            const ids = response.viewers;
            console.log(ids)
            if (response) {
              const respond = await story.findOne({ _id: _id });
              const count = respond.viewers;
              const uniqueViewers = new Set(count);
              const totalcount = uniqueViewers.size;
           
              const counts = count.reduce((acc, curr) => {
                acc[curr] ? acc[curr]++ : (acc[curr] = 1);
                return acc;
              }, {});
             
              const totalviewers = await story.findOneAndUpdate({ _id: _id }, { totalViewers: totalcount });
            
              if (totalcount, totalviewers) {
                const resul = await story.findOne({ _id: _id });
                const data = await usermaster.find({ _id: {$in: response.viewers}}, { _id: 1, profile_img: 1, name: 1 });
                console.log(data);
                const result = {
                  ...resul.toObject(),
                  viwerDetails: data.map(d => d.toObject())
                };
                
                return res.status(200).json({ Status: true, message: "story fetched  successfully", result });
              } else {
                return res.status(406).json({ message: 'no views yet' });
              }
            } else {
              return res.status(406).json({ message: 'error while updating the view' });
            }
          } else {
            const result = await story.findOne({ _id: _id });
            console.log(result);
            return res.status(200).json({ Status: true, message: "story fetched  successfully", result });
          }
        } else {
          return res.status(406).json({ message: 'error while updating the views' });
        }
      }
    } catch (err) {
      console.log(err);
      return res.status(400).json({ message: "something went wrong" });
    }
  }
  
// exports.getAllStory = async (req, res) => {
//     try {
//       const{user_id}=req.body
//       const user_ids=mongoose.Types.ObjectId(user_id)
//       //console.log(user_ids)
// const seeinconnections=await connection.find({'connections._id':user_ids},{_id:0,user_id:1})
// //console.log(seeinconnections)
// const user_ids_array = seeinconnections.map(connection => connection.user_id);
// console.log(user_ids_array)
// const userss = await usermaster.find({ _id: { $in: user_ids_array },connected:true },{_id:1});
// console.log(userss)

//       if(){
//         const connectedppl= await connectSchema.findOne({user_id:user_id},{_id:0,connections:1})
// const connectedids=connectedppl?.connections?.map(connection => connection._id) || []
// console.log(connectedids)
//       const user = await story.find(
//         { sender_id: { $nin: await usermaster.find({private:true}).distinct("_id") } ,
//         sender_id: { $in: connectedids }
//       },
//         {
//           _id: 1,
//           sender_id: 1,
//           pic: 1,
//           text: 1,
//           video: 1,
//           totalViewers: 1,
//           deleteTime: 1
//         }
//       )
  
//  // console.log(user)
//       const ids = user.map((doc) => doc.sender_id);
//       const names = await usermaster.find({ _id: { $in: ids } }, { _id: 1, name: 1 });
  
//       const nameMap = {};
//       names.forEach((name) => {
//         nameMap[name._id] = name.name;
//       });
  
//       const updatedUser = user.map((doc) => {
//         const name = nameMap[doc.sender_id];
//         return {
//           ...doc.toObject(),
//           name: name,
//         };
//       });
  
//       await story.updateMany({}, { $set: { name: { $cond: { if: { $eq: ["$sender_id", "$sender_id"] }, then: "$name", else: nameMap["$sender_id"] } } } });
  
//       res.status(200).send({ Status: true, message: "story fetched successfully", users: updatedUser });
//     }else{
//       const privateIds = await usermaster.find({ private: true, connected: true })
//       console.log(privateIds)
//       if(privateIds.length>0){
//       const user = await story.find(
//           { sender_id: { $nin: privateIds } },
//         {
//           _id: 1,
//           sender_id: 1,
//           pic: 1,
//           text: 1,
//           video: 1,
//           totalViewers: 1,
//           deleteTime: 1
//         }
//       )
  
//  // console.log(user)
//       const ids = user.map((doc) => doc.sender_id);
//       const names = await usermaster.find({ _id: { $in: ids } }, { _id: 1, name: 1 });
  
//       const nameMap = {};
//       names.forEach((name) => {
//         nameMap[name._id] = name.name;
//       });
  
//       const updatedUser = user.map((doc) => {
//         const name = nameMap[doc.sender_id];
//         return {
//           ...doc.toObject(),
//           name: name,
//         };
//       });
  
//       await story.updateMany({}, { $set: { name: { $cond: { if: { $eq: ["$sender_id", "$sender_id"] }, then: "$name", else: nameMap["$sender_id"] } } } });
  
//       res.status(200).send({ Status: true, message: "story fetched successfully", user: updatedUser });
//     }else{
//       const user = await story.find(
//         { sender_id: { $in: privateIds } },
//       {
//         _id: 1,
//         sender_id: 1,
//         pic: 1,
//         text: 1,
//         video: 1,
//         totalViewers: 1,
//         deleteTime: 1
//       }
//     )

// // console.log(user)
//     const ids = user.map((doc) => doc.sender_id);
//     const names = await usermaster.find({ _id: { $in: ids } }, { _id: 1, name: 1 });

//     const nameMap = {};
//     names.forEach((name) => {
//       nameMap[name._id] = name.name;
//     });

//     const updatedUser = user.map((doc) => {
//       const name = nameMap[doc.sender_id];
//       return {
//         ...doc.toObject(),
//         name: name,
//       };
//     });

//     await story.updateMany({}, { $set: { name: { $cond: { if: { $eq: ["$sender_id", "$sender_id"] }, then: "$name", else: nameMap["$sender_id"] } } } });

//     res.status(200).send({ Status: true, message: "story fetched successfully", user: updatedUser });
//     }
//   }
//    } catch (error) {
//       res.status(404).json({ message: error.message });
//     }
//   };
  
// exports.getAllStory = async (req, res) => {
//   try {
//     const stories = await story.find({}, {
//       _id: 1,
//       sender_id: 1,
//       pic: 1,
//       text: 1,
//       video: 1,
//       totalViewers: 1,
//       deleteTime: 1
//     });

//     const senderIds = stories.map((story) => story.sender_id);
//     const users = await usermaster.find({_id: {$in: senderIds}}, {_id: 1, name: 1});

//     const updatedStories = stories.map((story) => {
//       const user = users.find((user) => user._id.toString() === story.sender_id.toString());
//       return {
//         ...story.toObject(),
//         name: user ? user.name : ''
//       };
//     });

//     res.status(200).send({ Status: true, message: "story fetched successfully", users: updatedStories });
//   } catch (error) {
//     res.status(404).json({ message: error.message });
//   }
// };




  
  

// exports.getAllStory = async (req, res) => {
//   try {
// const{user_id}=req.body
// const user_ids=mongoose.Types.ObjectId(user_id)
// console.log(user_ids)
// const seeinconnections=await connectSchema.find({'connections._id':user_ids},{_id:0,user_id:1})
// console.log(seeinconnections)
// const user_ids_array = seeinconnections.map(connection => connection.user_id);
// console.log(user_ids_array)
// const userss = await usermaster.find({ _id: { $in: user_ids_array },connected:true },{_id:1});
// console.log(userss)
// const user_idss = userss.map(user => user._id);
// const data=await usermaster.find({public:true})
// const isPrivatetrue = data.map(user => user._id)
// console.log(isPrivatetrue)




// const stories = await story.find({ user_id: { $in: user_idss } });
// console.log(stories);


// const stories1 = await story.find({ user_id: { $in: isPrivatetrue } });
// console.log(stories);

//  } catch (error) {
//     res.status(404).json({ message: error.message });
//   }
// };


exports.getAllStory = async (req, res) => {
  try {
    const { user_id } = req.body;
    const user_ids = mongoose.Types.ObjectId(user_id);

    const seeinconnections = await connectSchema.find(
      { 'connections._id': user_ids },
      { _id: 0, user_id: 1 }
    );
    const user_ids_array = seeinconnections.map(connection => connection.user_id);

    const userss = await usermaster.find({ _id: { $in: user_ids_array }, connected: true }, { _id: 1 });
    const user_idss = userss.map(user => user._id);

    const data = await usermaster.find({ public: true }, { _id: 1 });
    const isPrivatetrue = data.map(user => user._id);
console.log(isPrivatetrue)
    const storiesWithSenderName = await story.find({ sender_id: { $in: user_idss } })
      .populate('sender_id', 'name')
      .select({
        _id: 1,
        sender_id: 1,
        pic: 1,
        text: 1,
        video: 1,
        totalViewers: 1,
        deleteTime: 1
      })
      .exec();

    const privateStoriesWithSenderName = await story.find({ sender_id: { $in: isPrivatetrue } })
      .populate('sender_id', 'name')
      .select({
        _id: 1,
        sender_id: 1,
        pic: 1,
        text: 1,
        video: 1,
        totalViewers: 1,
        deleteTime: 1,
      })
      .exec();

    const allStories = [...storiesWithSenderName, ...privateStoriesWithSenderName];

    const senderIds = allStories.map((story) => story.sender_id);
    const users = await usermaster.find({ _id: { $in: senderIds } }, { _id: 1, name: 1 });

    const updatedStories = allStories.map((story) => {
      const user = users.find((user) => user._id.toString() === story.sender_id.toString());
      return {
        ...story.toObject(),
        name: user ? user.name : ''
      };
    }).filter((story, index, self) =>
      index === self.findIndex(s => s._id.toString() === story._id.toString())
    );

    console.log(updatedStories);
    res.status(200).json(updatedStories);
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: error.message });
  }
};


