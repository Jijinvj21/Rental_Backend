const express = require('express')
const token_router = express()
const adminTokenVerifyController = require('../../controller/tokenVerify/adminTokenVerify')
const vendorTokenVerifyController = require('../../controller/tokenVerify/vendorTokenVerify')
const userTokenVerifyController = require('../../controller/tokenVerify/userTokenVerify')



token_router.get('/tokenVerify', adminTokenVerifyController.adminCheckAuth)
token_router.get('/vendortokenVerify', vendorTokenVerifyController.VendorCheckAuth)
token_router.get('/usertokenVerify', userTokenVerifyController.userCheckAuth)


module.exports = token_router