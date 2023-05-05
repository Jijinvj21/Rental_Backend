const express = require("express");
const userRoute = require("./router/user/userRouter");
const adminRoute = require("./router/admin/adminRouter");
const vendorRoute = require("./router/vendor/vendorRouter");
const filterRoute = require("./router/filter/filterController");
const tokenCheck = require("./router/token/tokenVerifyController");
const chat_router = require("./router/chat/chat");
const review_router = require("./router/review/review");
require("./config/config");

const app = express();
const cors = require("cors");
const path = require("path");

app.use(
  cors({
    // origin: [`http://localhost:3000`, "https://rental.jijinvj.tech"],
    origin: ["https://rental.jijinvj.tech"],
    // origin:'*',
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
const staticPath = path.join(__dirname, "public");
app.use(express.static(staticPath));
app.use(express.json());

app.use("/api/", userRoute);
app.use("/api/admin", adminRoute);
app.use("/api/vendor", vendorRoute);
app.use("/api/filter", filterRoute);
app.use("/api/token", tokenCheck);
app.use("/api/chat", chat_router);
app.use("/api/review", review_router);

const server = app.listen(9000, function () {
  console.log("Server is running on port 9000 ");
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "https://rental.jijinvj.tech",
  },
});

let users = [];
let adminId;
const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  //when connect
  console.log("a user connected");

  socket.on("addUser", (data) => {
    data.role == "admin"
      ? (adminId = socket.id)
      : addUser(data.userId, socket.id);
  });

  socket.on("send-message", ({ userId, message, sender }) => {
    const messageData = {
      senderId: userId,
      sender,
      message,
    };
    const user = getUser(userId);
    user && io.to(user?.socketId).emit("getMessage", messageData);
    io.to(adminId).emit("getMessage", messageData);
  });

  // //when disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});
