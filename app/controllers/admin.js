const adminmodel=require('../models/admin')
const usermaster=require('../models/registration')
const connection=require('../models/connection')
const postSchema=require('../models/posts')
const bookmarkSchema=require('../models/bookmarks')
const reportuserSchema=require('../models/report')
const reoportsPostSchema=require('../models/reportpost')
const likePostSchema=require('../models/likespost')
const requestSchema=require('../models/requests')
const reportPostSchema=require('../models/reportpost')
const feedBackSchema=require('../models/feedback')
const blockpostSchema=require('../models/blockpost')

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
      
      if (!user) {
        return res.status(401).send({ message: 'invalid user_name' });
      }
  
      if (user) {
        return res.status(401).send({ message: 'invalid password' });
      }
  
      return res.status(200).json({ Status:true,message:'Login successfull' ,user});
    } catch (error) {
     
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
  exports.newusers = async (req, res) => {
    try {
      const now = new Date();
      const targetDate = new Date(now.getFullYear(), now.getMonth(), 23, 0, 0, 0);
      const nextDay = new Date(now.getFullYear(), now.getMonth(), 24, 0, 0, 0);
  
      const count = await usermaster.countDocuments({
        createdAt: {
          $gte: targetDate,
          $lt: nextDay
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

      return res.status(400).json({Status: 'Error', Error: err.message});
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
  exports.connectionsOfAll = async (req, res) => {
    try {
      const users = await usermaster.find({}, { _id: 1, name: 1, profile_img: 1 });
      if (users) {
        const result = await Promise.all(
          users.map(async (user) => {
            const connections = await connection.find({ user_id: user._id }, { connections: { $slice: 1 }, _id: 0 });
            const mappedConnections = connections.map((conn) => conn.connections[0]);
            const totalConnections = mappedConnections.length;
            return { _id: user._id, name: user.name, profile_img: user.profile_img, connections: mappedConnections, totalConnections };
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
            const bookmarks = await bookmarkSchema.find({ user_id: user._id }, { _id: 0, saved: 1 });
            const saved = bookmarks.map((bookmark) => bookmark.saved);
            const totalSaved = bookmarks.length;
            return {
              _id: user._id,
              name: user.name,
              profile_img: user.profile_img,
              bookmark: saved,
              totalSaved,
            };
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
            const connections = await connection.find({ user_id: user._id }, { totalrequest: { $slice: 1 }, _id: 0 });
            const mappedConnections = connections.map((conn) => conn.totalrequest[0]);
            const filteredConnections = mappedConnections.filter((conn) => conn !== null && conn !== undefined);
            const totalRequests = filteredConnections.length;
            return { _id: user._id, name: user.name, profile_img: user.profile_img, requests: filteredConnections, totalRequests };
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
  
  
exports.postYouHaveLiked = async (req, res) => {
    try {
      const users = await usermaster.find({}, { _id: 1, name: 1, profile_img: 1 });
      if (users) {
        const result = await Promise.all(
          users.map(async (user) => {
            const likedpost = await likePostSchema.find({ 'likesofposts._id': user._id }, {_id: 0,post_id:1,Post_img:1 });
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
  exports.totalReportsAllPost = async (req, res) => {
    try {
      const users = await usermaster.find({}, { _id: 1, name: 1, profile_img: 1 });
      if (users) {
        const result = await Promise.all(
          users.map(async (user) => {
            const connections = await connection.find({ user_id: user._id }, { totalrequest: { $slice: 1 }, _id: 0 });
            const mappedConnections = connections.map((conn) => conn.totalrequest[0]);
            const totalRequests = mappedConnections.length;
            return { _id: user._id, name: user.name, profile_img: user.profile_img, requests: mappedConnections, totalRequests };
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
exports.feedBackOfAll=async(req,res)=>{
  try { 
      const users = await usermaster.find({}, { _id: 1, name: 1, profile_img: 1 });
      if (users) {
        const result = await Promise.all(
          users.map(async (user) => {
            //const reportUser = await reportPostSchema.find({ reporter_id: user._id }, { _id: 0, reportreason: 1,report_id:1 });
            const feedback = await feedBackSchema.find({ feedback_id: user._id }, { _id: 0, feedback:1});
  
            //const reports = [...reportUser, ...reportPost]; 
  
            const totalFeedback = feedback.length; 
  
            return { _id: user._id, name: user.name, profile_img: user.profile_img, totalFeedback, feedback };
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
exports.reportsOfUser = async (req, res) => {
  try {
    const users = await usermaster.find({}, { _id: 1, name: 1, profile_img: 1 });
    if (users) {
      
      const result = await Promise.all(
        users.map(async (user) => {
          const reports = await reportuserSchema.find({ reporter_id: user._id }, { _id: 0, reportreason: 1, report_id: 1 });

          const totalReports = reports.length;

          const mappedReports = await Promise.all(
            reports.map(async (report) => {
              const userDoc = await usermaster.findOne({ _id: report.report_id }, { name: 1, profile_img: 1 });

              return {
                ...report._doc,
                profile_img: userDoc.profile_img,
                name: userDoc.name
              };
            })
          );

          return { _id: user._id, name: user.name, profile_img: user.profile_img, totalReports, reports: mappedReports };
        })
      );
      res.send({ status: true, message: "Get Data Successfully", result });
    } else {
      res.status(401).send({ message: "No data available" });
    }
  } catch (err) {
    console.log(err)
    res.send({ message: "Something went wrong" });
  }
}

// exports.postBlock = async (req, res) => {
//   try {
//     const users = await usermaster.find({}, { _id: 1, name: 1, profile_img: 1 });
//     if (users) {
//       const result = await Promise.all(
//         users.map(async (user) => {
//           const blockposts = await postSchema.find({ user_id: user._id }, { _id: 0, post_blocked: 1 });
//           const nonEmptyBlocks = blockposts.filter((post) => post.post_blocked.length > 0);

//           const blockedPostsWithDetails = await Promise.all(
//             nonEmptyBlocks.map(async (post) => {
//               const blockedUser = await usermaster.findOne({ _id: post.post_blocked[0] }, { name: 1, profile_img: 1 });
//               return {
//                 post_id: post._id,
//                 post_blocked: post.post_blocked,
//                 blockedUserDetails: blockedUser,
//               };
//             })
//           );

//           const totalblockposts = blockedPostsWithDetails.length;

//           return { _id: user._id, name: user.name, profile_img: user.profile_img, blockposts: blockedPostsWithDetails, totalblockposts };
//         })
//       );

//       res.send({ status: true, message: "Get Data Successfully", result });
//     } else {
//       res.status(401).send({ message: "No data available" });
//     }
//   } catch (err) {
//     console.log(err);
//     res.send({ message: "Something went wrong" });
//   }
// };


exports.blocks = async (req, res) => {
  try {
    const users = await usermaster.find({}, { _id: 1, name: 1, profile_img: 1 });
    if (users) {
      const result = await Promise.all(
        users.map(async (user) => {
          const blocks = await usermaster.findOne({ _id: user._id }, { blockContact: 1, _id: 0 });
          const blockContactIds = blocks.blockContact;
          const totalblocks = blockContactIds.length || 0;

          const blockContacts = await Promise.all(
            blockContactIds.map(async (contactId) => {
              const blockedUser = await usermaster.findOne({ _id: contactId }, { _id: 1, name: 1, profile_img: 1 });
              return blockedUser;
            })
          );

          return { _id: user._id, name: user.name, profile_img: user.profile_img, blocks: blockContacts, totalblocks };
        })
      );

      res.send({ status: true, message: "Get Data Successfully", result });
    } else {
      res.status(401).send({ message: "No data available" });
    }
  } catch (err) {
    console.log(err);
    res.send({ message: "Something went wrong" });
  }
};


exports.postBlock = async (req, res) => {
  try {
    const users = await usermaster.find({}, { _id: 1, name: 1, profile_img: 1 });
    if (users) {
      const result = await Promise.all(
        users.map(async (user) => {
          const blockposts = await blockpostSchema.find(
            { blocker_id: user._id },
            { _id: 0, post_id: 1, blocking_reason: 1, blocker_id: 1, post_owner: 1 }
          );

          const totalblockposts = blockposts.length;

          const mappedreportpost = await Promise.all(
            blockposts.map(async (report) => {
              const userDoc = await postSchema.findOne(
                { _id: report.post_id },
                { _id: 0, Post_img: 1 }
              );

              // Fetch name and profile_img of post_owner
              const postOwner = await usermaster.findOne(
                { _id: report.post_owner },
                { _id: 0, name: 1, profile_img: 1 }
              );

              if (userDoc && userDoc.Post_img) {
                return {
                  ...report._doc,
                  Post_img: userDoc.Post_img,
                  post_owner: {
                    _id: report.post_owner,
                    name: postOwner.name,
                    profile_img: postOwner.profile_img
                  }
                };
              } else {
                // Handle the case when userDoc or userDoc.Post_img is null
                return {
                  ...report._doc,
                  Post_img: 'default_img.jpg',
                  post_owner: {
                    _id: report.post_owner,
                    name: postOwner.name,
                    profile_img: postOwner.profile_img
                  }
                };
              }
            })
          );

          return {
            _id: user._id,
            name: user.name,
            profile_img: user.profile_img,
            totalblockposts,
            PostsBlock: mappedreportpost
          };
        })
      );

      res.send({ status: true, message: "Get Data Successfully", result });
    } else {
      res.status(401).send({ message: "No data available" });
    }
  } catch (err) {
    console.log(err);
    res.send({ message: "Something went wrong" });
  }
};


exports.reportOfPost = async (req, res) => {
  try {
    const users = await usermaster.find({}, { _id: 1, name: 1, profile_img: 1 });
    if (users) {
      const result = await Promise.all(
        users.map(async (user) => {
          const reportPost = await reportPostSchema.find(
            { reporter_id: user._id },
            { _id: 0, reportreason: 1, post_id: 1, reporter_email: 1 }
          );
          const totalReports = reportPost.length;

          const mappedreportpost = await Promise.all(
            reportPost.map(async (report) => {
              const userDoc = await postSchema.findOne(
                { _id: report.post_id },
                { _id: 0, Post_img: 1 }
              );
              const postImg = userDoc ? userDoc.Post_img : null;
              return {
                ...report._doc,
                Post_img: postImg,
              };
            })
          );

          return { _id: user._id, name: user.name, profile_img: user.profile_img, totalReports, reportPost: mappedreportpost };
        })
      );
      res.send({ status: true, message: "Get Data Successfully", result });
    } else {
      res.status(401).send({ message: "No data available" });
    }
  } catch (err) {
    console.log(err);
    res.send({ message: "Something went wrong" });
  }
};