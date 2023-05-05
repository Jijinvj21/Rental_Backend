const conversationModel = require("../model/chat/ConversationModel");
const messageModel = require("../model/chat/MessageModel");
const userModal = require("../model/user/userModel");
const jwt = require("jsonwebtoken");

const newConversation = async (req, res) => {
  try {
    if (req.body.userId) {
      const findRoom = await conversationModel.findOne({
        member: req.body.userId,
      });
      if (!findRoom) {
        const newConversation = new conversationModel({
          adminId: req.body.adminId,
          member: req.body.userId,
        });
        const added = await newConversation.save();
        if (added) {
          const findRoom = await conversationModel.findOne({
            adminId: req.body.adminId,
          });
          res.status(200).json({
            message: "saved in mongo db",
            conversationId: findRoom._id,
          });
        } else {
          res.status(401).json("mongodb error");
        }
      } else {
        {
          const findRoom = await conversationModel.findOne({
            member: req.body.userId,
          });
          res.status(200).json({
            message: "member already exists",
            conversationId: findRoom._id,
          });
        }
      }
    } else {
      res.status(401).json("there is no id");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};



//users of room
const getUsers = async (req, res) => {
  const token = req.body.admin.split(" ")[0];
  let { _id } = jwt.verify(token, process.env.JWT_SECRET);
  try {
    if (_id) {
      const room = await conversationModel
        .find({
          adminId: _id,
        })
        .populate("member");
      if (room.length) {
        res.status(200).json(room);
      } else {
        res.status(404).json("No conversations found");
      }
    } else {
      res.status(400).json("adminId is required");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json("Something went wrong");
  }
};

// add message to the document of room

const addMessage = async (req, res) => {
  const newmessage = new messageModel(req.body);
  try {
    const savedMessage = await newmessage.save();
    if (savedMessage) {
      res.status(200).json(savedMessage);
    } else {
      res.status(401).json("mongodb error");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// get message using room id

const getMessage = async (req, res) => {
  try {
    let message;
    message = await messageModel.find({
      conversationId: req.body.conversationId,
      sender: { $in: [req.body.userId] },
    });

    if (message) {
      res.status(200).json(message);
    } else {
      res.status(401).json("no conversations");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  newConversation,
  // getRoom,
  getUsers,
  addMessage,
  getMessage,
};
