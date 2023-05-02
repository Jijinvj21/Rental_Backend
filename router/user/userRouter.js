const express = require('express')
const user_router = express()
const userAuthController = require('../../controller/user/userAuth')
const cycleRentController = require('../../controller/user/cycleRentController')
const userProfileController = require('../../controller/user/userProfileController')
const uploadbuffer = require("../../util/cloudenaryMulter")

const userVerify = require("../../middleware/userVerification")
const vendorVerify = require("../../middleware/vendorAuthVerify")




user_router.post('/login', userAuthController.login)
user_router.post('/VerifyOtp', userAuthController.VerifyOtp)
user_router.post('/signup', userAuthController.signup)


user_router.post('/vendorAccessories',vendorVerify, cycleRentController.vendorAccessories)
user_router.post('/profileUpdate',userVerify,uploadbuffer.single("image"), userProfileController.userProfile)
user_router.post('/booked',userVerify, cycleRentController.booked)


module.exports = user_router
