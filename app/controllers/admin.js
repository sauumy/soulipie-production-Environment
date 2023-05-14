const adminmodel=require('../models/admin')
const usermaster=require('../models/registration')
const connection=require('../models/connection')
const postSchema=require('../models/posts')
const bookmarkSchema=require('../models/bookmarks')
const reportuserSchema=require('../models/report')
const reoportsPostSchema=require('../models/reportpost')
const likePostSchema=require('../models/likespost')

exports.create= async  (req, res) => {
    if(!req.body.user_name && !req.body.password){
        return res.status(406).send({Status:false,message:'user_name & password is required field'})
    }

        const user =  new adminmodel({
            user_name:req.body.user_name,
            password:req.body.password
        });
        
        const users=await user.save().then(data => {
            res.send({
                message:"User created successfully!!",
                users:data
            });
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating user"
            });
        });
    
};

exports.adminlogin=async(req,res)=>{
  
    const { user_name,password} = req.body;
    try {
      const user = await adminmodel.findOne({ user_name:user_name,password:password });
      console.log(user)
      if (!user) {
        return res.status(401).send({ message: 'invalid user_name' });
      }
  
      if (user) {
        return res.status(401).send({ message: 'invalid password' });
      }
  
      return res.status(200).json({ Status:true,message:'Login successfull' ,user});
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
exports.newusers = async (req, res) => {
  
    try {
      
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
      const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
  
      
      const count = await usermaster.countDocuments({
        created_at: {
          $gte: todayStart,
          $lt: todayEnd
        }
      });
  
     
      res.json({ count });
    } catch (error) {
      
      res.status(500).json({ message: error.message });
    }
  };

 exports.totalusers=async (req, res) => {
    try {
        const user = await usermaster.count()

        res.status(200).json({status:true,message:"total counts of users",user});
    } catch(error) {
        res.status(404).json({message: error.message});
    }
};

exports.matchesofUsers = async (req, res) => {
    try {
      const users = await usermaster.find({}, {_id: 1, name: 1, profile_img: 1, AstroSign: 1, Hobbies: 1}); 
      const matchesCount = {}; 
      const matchesData = {}; 
  
     
      users.forEach(user => {
        const userId = user._id.toString();
        const Astro = user.AstroSign;
        const Hobbies = user.Hobbies;
        const respons = users.filter(u => u.AstroSign === Astro && u._id.toString() !== userId); 
        const respond = users.filter(u => u.Hobbies.some(h => Hobbies.includes(h)) && u._id.toString() !== userId); 
        const userIds = new Set();
  
        
        respons.forEach(user => {
          userIds.add(user._id.toString());
        });
        respond.forEach(user => {
          userIds.add(user._id.toString());
        });
  
   
        matchesCount[userId] = userIds.size;
        matchesData[userId] = userIds;
      });
  
      for (const [userId, count] of Object.entries(matchesCount)) {
        await usermaster.updateOne({_id: userId}, {matchesCount: count});
      }
  
      const usersWithMatches = users.map(user => {
        const userId = user._id.toString();
        const matches = [...matchesData[userId]];
        delete matches[matches.indexOf(userId)];
        const matchProfiles = users.filter(u => matches.includes(u._id.toString())).map(u => ({_id: u._id, name: u.name, profile_img: u.profile_img}));
        return {
          _id: userId,
          name: user.name,
          profile_img: user.profile_img,
          matches: matchProfiles,
          total_matches: matchProfiles.length
        }
      });
  
      return res.status(200).json({Status: true, message: 'matches fetched successfully', users: usersWithMatches});
    } catch (err) {
      console.log('err', err.message);
      return res.status(400).json({Status: 'Error', Error: err.message});
    }
  }
  
exports.connectionsOfAll = async (req, res) => {
    try {
      const users = await usermaster.find({}, { _id: 1, name: 1, profile_img: 1 });
      if (users) {
        const result = await Promise.all(
          users.map(async (user) => {
            const connections = await connection.find({ user_id: user._id }, { connections: 1, _id: 0 });
            const totalConnections = connections.length;
            return { _id: user._id, name: user.name, profile_img: user.profile_img, connections, totalConnections };
          })
        );
        res.send({ status: true, message: "Get Data Successfully", result });
      } else {
        res.status(401).send({ message: "No data available" });
      }
    } catch (err) {
      res.send({ message: "Something went wrong" });
    }
  }
exports.postOfOfAll = async (req, res) => {
    try {
      const users = await usermaster.find({}, { _id: 1, name: 1, profile_img: 1 });
      if (users) {
        const result = await Promise.all(
          users.map(async (user) => {
            const posts = await postSchema.find({ user_id: user._id }, { Post_img: 1, _id: 0 ,Post_discription:1,Tagged_people:1,totallikesofpost:1,totalcomments:1});
            const totalposts = posts.length;
            return { _id: user._id, name: user.name, profile_img: user.profile_img, posts, totalposts };
          })
        );
        res.send({ status: true, message: "Get Data Successfully", result });
      } else {
        res.status(401).send({ message: "No data available" });
      }
    } catch (err) {
      res.send({ message: "Something went wrong" });
    }
  }

exports.bookMarksOfAll = async (req, res) => {
    try {
      const users = await usermaster.find({}, { _id: 1, name: 1, profile_img: 1 });
      if (users) {
        const result = await Promise.all(
          users.map(async (user) => {
            const bookmark = await bookmarkSchema.find({ user_id: user._id }, {_id: 0,saved:1});
            const totalsaved = bookmark.length;
            return { _id: user._id, name: user.name, profile_img: user.profile_img, bookmark, totalsaved };
          })
        );
        res.send({ status: true, message: "Get Data Successfully", result });
      } else {
        res.status(401).send({ message: "No data available" });
      }
    } catch (err) {
      res.send({ message: "Something went wrong" });
    }
  }
exports.reportsOfAll = async (req, res) => {
    try {
      const users = await usermaster.find({}, { _id: 1, name: 1, profile_img: 1 });
      if (users) {
        const result = await Promise.all(
          users.map(async (user) => {
            const reportUser = await reportuserSchema.find({ reporter_id: user._id }, { _id: 0, reportreason: 1,report_id:1 });
            const reportPost = await reoportsPostSchema.find({ reporter_id: user._id }, { _id: 0, reportreason: 1,post_id:1 });
  
            const reports = [...reportUser, ...reportPost]; 
  
            const totalReports = reports.length; 
  
            return { _id: user._id, name: user.name, profile_img: user.profile_img, totalReports, reports };
          })
        );
        res.send({ status: true, message: "Get Data Successfully", result });
      } else {
        res.status(401).send({ message: "No data available" });
      }
    } catch (err) {
      res.send({ message: "Something went wrong" });
    }
  };
exports.requestsOfAll = async (req, res) => {
    try {
      const users = await usermaster.find({}, { _id: 1, name: 1, profile_img: 1 });
      if (users) {
        const result = await Promise.all(
          users.map(async (user) => {
            const requests = await connection.find({ user_id: user._id }, { totalrequest: 1, _id: 0 });
            const totalrequest = requests.length;
            return { _id: user._id, name: user.name, profile_img: user.profile_img,totalrequest,requests };
          })
        );
        res.send({ status: true, message: "Get Data Successfully", result });
      } else {
        res.status(401).send({ message: "No data available" });
      }
    } catch (err) {
      res.send({ message: "Something went wrong" });
    }
  }
exports.postYouHaveLiked = async (req, res) => {
    try {
      const users = await usermaster.find({}, { _id: 1, name: 1, profile_img: 1 });
      if (users) {
        const result = await Promise.all(
          users.map(async (user) => {
            const likedpost = await likePostSchema.find({ 'likesofposts._id': user._id }, {_id: 0,post_id:1 });
            const totallikedpost = likedpost.length;
            return { _id: user._id, name: user.name, profile_img: user.profile_img,totallikedpost,likedpost };
          })
        );
        res.send({ status: true, message: "Get Data Successfully", result });
      } else {
        res.status(401).send({ message: "No data available" });
      }
    } catch (err) {
      res.send({ message: "Something went wrong" });
    }
  }
exports.totalPrivateAccount = async (req, res) => {
    try {
      const users = await usermaster.find({private:true}, { _id: 1, name: 1, profile_img: 1 });
      if (users) {
            const totalPrivateAccount = users.length;
        res.send({ status: true, message: "Get Data Successfully", totalPrivateAccount });
      } else {
        res.status(401).send({ message: "No data available" });
      }
    } catch (err) {
      res.send({ message: "Something went wrong" });
    }
  } 
  exports.totalConnectedAccount = async (req, res) => {
    try {
      const users = await usermaster.find({connected:true}, { _id: 1, name: 1, profile_img: 1 });
      if (users) {
            const totalConnectedAccount = users.length;
        res.send({ status: true, message: "Get Data Successfully", totalConnectedAccount });
      } else {
        res.status(401).send({ message: "No data available" });
      }
    } catch (err) {
      res.send({ message: "Something went wrong" });
    }
  } 

  exports.totalPublicAccount = async (req, res) => {
    try {
      const users = await usermaster.find({public:true}, { _id: 1, name: 1, profile_img: 1 });
      if (users) {
            const totalPublicAccount = users.length;
        res.send({ status: true, message: "Get Data Successfully", totalPublicAccount });
      } else {
        res.status(401).send({ message: "No data available" });
      }
    } catch (err) {
      res.send({ message: "Something went wrong" });
    }
  } 