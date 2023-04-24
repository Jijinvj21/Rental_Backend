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





app.listen(9000, function () {
    console.log("Server is running on port 9000 ");
});