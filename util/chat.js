const conversationModel = require('../model/chat/ConversationModel')
const messageModel = require('../model/chat/MessageModel')
const userModal = require('../model/user/userModel')
const jwt = require("jsonwebtoken");

//set user id and admin id create room
const newConversation = async (req, res) => {
  console.log(req.body);
    try {
        if (req.body.userId) {
          const findRoom = await conversationModel.findOne({ member: req.body.userId });
console.log(findRoom)
          if (!findRoom) {
            const token = req.body.adminId.split(" ")[0];
            let { _id } = jwt.verify(token, process.env.JWT_SECRET);
            const newConversation = new conversationModel({
              adminId: _id,
              member:  req.body.userId
            });
            const added = await newConversation.save();
            if (added) {
              const findRoom = await conversationModel.findOne({ adminId: req.body.adminId });
              res.status(200).json( {message:'saved in mongo db',conversationId:findRoom._id });
            } else {
              res.status(401).json('mongodb error');
            }
          } else {
            {
          const findRoom = await conversationModel.findOne({ member: req.body.userId });
console.log(findRoom._id);
              res.status(200).json({message:'member already exists',conversationId:findRoom._id });
            }
          }
        } else {
          res.status(401).json('there is no id');
        }
      } catch (error) {
        res.status(500).json(error);
      }
      
}


// find the room collect of user
// const getRoom = async (req, res) => {
//     try {
//         if (req.params.userId) {
//             const room = await conversationModel.find({
//                 member: { $in: [req.params.userId] }
//             })
//             if (room.length) {
//                 res.status(200).json(req.params.userId)
//             } else {
//                 res.status(404).json('No conversations found')
//             }
//         } else {
//             res.status(400).json('userId is required')
//         }
//     } catch (error) {
//         console.error(error)
//         res.status(500).json('Something went wrong')
//     }
// }



//users of room
const getUsers = async (req, res) => {
    console.log(1112);
    // const { authorization } = req.headers;
    const token = req.body.admin.split(" ")[0];
    let { _id } = jwt.verify(token, process.env.JWT_SECRET);
    console.log(_id);
    try {
        if (_id) {
            const room = await conversationModel.find({
                adminId: _id
            }).populate('member')
            console.log(room);
            if (room.length) {
                
                res.status(200).json(room);
                
            } else {
                res.status(404).json('No conversations found')
            }
        } else {
            res.status(400).json('adminId is required')
        }
    } catch (error) {
        console.error(error)
        res.status(500).json('Something went wrong')
    }
}






// add message to the document of room

const addMessage = async (req, res) => {
  console.log('....');
  console.log(req.body);
  console.log('....');
    const newmessage = new messageModel(req.body)
    try {
        const savedMessage = await newmessage.save()
        if (savedMessage) {
            res.status(200).json(savedMessage)
        } else {
            res.status(401).json('mongodb error')
        }
    } catch (error) {
        res.status(500).json(error)
    }
}


// get message using room id

const getMessage = async (req, res) => {
    console.log(1111);
    console.log(req.body.userId);
    console.log(1111);
    try {
      let message
   message = await messageModel.find({
    conversationId:req.body.conversationId ,
    sender: { $in: [req.body.userId ] }
})

       

        if (message) {
            res.status(200).json(message)
        } else {
            res.status(401).json('no conversations')
        }
    } catch (error) {
        res.status(500).json(error)
    }
}





module.exports = {
    newConversation,
    // getRoom,
    getUsers,
    addMessage,
    getMessage

}