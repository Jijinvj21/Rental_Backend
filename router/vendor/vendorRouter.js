const express = require('express')
const vendor_router = express()
const cyclemanagementController = require('../../controller/vendor/cycleManagementController')
const accessoriesmanagementController = require('../../controller/vendor/accessorieManagement')
const bookingManagement = require('../../controller/vendor/bookingManagent')


const uploadbuffer = require("../../util/cloudenaryMulter")
const vendorToken = require('../../middleware/vendorAuthVerify')

vendor_router.post('/insert_cycle',vendorToken, uploadbuffer.single("image"), cyclemanagementController.insertCycle)
vendor_router.get('/cycleStatus_Update/:id',vendorToken, cyclemanagementController.cycleStatus_Update)

vendor_router.post('/insert_accessories',vendorToken, uploadbuffer.single("image"), accessoriesmanagementController.insertAccessories)
vendor_router.get('/accessoriesStatus_Update/:id',vendorToken, accessoriesmanagementController.accessoriesStatus_Update)


vendor_router.post('/cycleReturnStatus',vendorToken,bookingManagement.cycleReturnStatus)

vendor_router.post('/edit_accessories',vendorToken, uploadbuffer.single("image"), accessoriesmanagementController.editAccessories)
vendor_router.post('/edit_cycle',vendorToken, uploadbuffer.single("image"),cyclemanagementController.editCycle)











module.exports = vendor_router