const express = require("express");
const userRoute= require('./router/user/userRouter')
const adminRoute = require('./router/admin/adminRouter')
const vendorRoute = require('./router/vendor/vendorRouter')
const filterRoute = require("./router/filter/filterController");
const tokenCheck= require('./router/token/tokenVerifyController')
const chat_router = require("./router/chat/chat");
const review_router = require("./router/review/review");
require('./config/config')


const app = express();
const cors = require('cors')
const path=require('path');

app.use(cors(
    {
        origin: [`http://localhost:3000`],
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true
    }
))
const staticPath = path.join(__dirname, 'public')
app.use(express.static(staticPath))
app.use(express.json())

app.use('/',userRoute)
app.use('/admin',adminRoute)
app.use('/vendor',vendorRoute)
app.use('/filter',filterRoute)
app.use('/token',tokenCheck)
app.use('/chat',chat_router)
app.use('/review',review_router)


const server = app.listen(9000, function () {
    console.log("Server is running on port 9000 ");
});




const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
      origin: 'http://localhost:3000',
    },
  });
  
  let users=[]
  console.log(users)
  const addUser = (userId,socketId)=>{
    
    console.log(socketId)
    !users.some((user)=>user.userId===userId) && users.push({userId,socketId})
  }
  
  const removeUser=(socketId)=>{
    users=users.filter(user=>user.socketId!==socketId)
  }
  
  const getUser=(userId)=>{
    return users.find(user=>user.userId===userId)
  }
  
  io.on("connection",(socket)=>{
    //when connect
    console.log("a user connected")
    io.emit('wel','hello')
    //take userId and socketId from user
    socket.on("addUser",userId=>{
        // console.log(userId)
      addUser(userId,socket.id)
      io.emit("getUsers",users)
    })
  
    // //send and get message
    socket.on("sendMessage",({senderId,receiverId,text})=>{
      const user = getUser(receiverId)
      io.to(user?.socketId).emit("getMessage",{
        senderId,
        text
      })
    })
  
    // //when disconnect
    socket.on("disconnect",()=>{
      console.log("a user disconnected")
      removeUser(socket.id)
      io.emit("getUsers",users)
    })
  })