const conversationModel = require('../model/chat/ConversationModel')
const messageModel = require('../model/chat/MessageModel')
const userModal = require('../model/user/userModel')

//set user id and admin id create room
const newConversation = async (req, res) => {
    try {
        if (req.body.userId && req.body.adminId) {
          const findRoom = await conversationModel.findOne({ adminId: req.body.adminId });
          if (!findRoom) {
            const newConversation = new conversationModel({
              adminId: req.body.adminId,
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
            const memberExists = findRoom.member.includes(req.body.userId);
            if (!memberExists) {
              const adduserId = await conversationModel.updateOne(
                { adminId: req.body.adminId },
                { $push: { member: req.body.userId } }
              );
              if (adduserId) {
                const findRoom = await conversationModel.findOne({ adminId: req.body.adminId });
                res.status(200).json({message:'userId added',conversationId:findRoom._id });
              } else {
                res.status(401).json('mongodb error');
              }
            } else {
          const findRoom = await conversationModel.findOne({ adminId: req.body.adminId });
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
const getRoom = async (req, res) => {
    try {
        if (req.params.userId) {
            const room = await conversationModel.find({
                member: { $in: [req.params.userId] }
            })
            if (room.length) {
                res.status(200).json(req.params.userId)
            } else {
                res.status(404).json('No conversations found')
            }
        } else {
            res.status(400).json('userId is required')
        }
    } catch (error) {
        console.error(error)
        res.status(500).json('Something went wrong')
    }
}



//users of room
const getUsers = async (req, res) => {
    console.log(111);
    try {
        if (req.body.adminId) {
            const room = await conversationModel.find({
                adminId: req.body.adminId
            })
            if (room.length) {
                let userArray = room[0].member;
                let userDataArray = [];
                
                for (let value of userArray) {
                  const userData = await userModal.find({_id: value});
                  userDataArray.push(userData);
                }
                console.log(userDataArray);
                res.status(200).json(userDataArray);
                
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
    console.log(req.body.admin);
    console.log(1111);
    try {
      let message
// if(req.body.admin){
//    message = await messageModel.find({
//     conversationId:req.body.conversationId ,
//     sender: { $in: [req.body.userId ] },
//     admin:req.body.admin
// })
// }else{
   message = await messageModel.find({
    conversationId:req.body.conversationId ,
    sender: { $in: [req.body.userId ] }
})
// }
       

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
    getRoom,
    getUsers,
    addMessage,
    getMessage

}