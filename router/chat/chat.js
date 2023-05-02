const express = require("express");
const chat_router = express();

const chatController = require("../../util/chat");

chat_router.post("/newConversation", chatController.newConversation);
// chat_router.get('/getroom/:userId',chatController.getRoom )
chat_router.post("/getusers", chatController.getUsers);
chat_router.post("/addMessage", chatController.addMessage);
chat_router.post("/getMessage", chatController.getMessage);

module.exports = chat_router;
