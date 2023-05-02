const express = require("express");
const admin_router = express();
const adminUserController = require("../../controller/admin/AdminUserList");
const adminVendorController = require("../../controller/admin/AdminVendorControll");
const adminLogin = require("../../controller/admin/AdminLogin");
const authVerify = require("../../middleware/AuthVerification");
const adminDashboard = require("../../controller/admin/AdminDashboard");

admin_router.post(
  "/userStatus_Update",
  authVerify,
  adminUserController.userStatus_Update
);

admin_router.post(
  "/vendorStatus_Update",
  authVerify,
  adminVendorController.vendorStatus_Update
);

admin_router.post("/adminLogin", adminLogin.adminLogin);
admin_router.get("/adminDashnoard", adminDashboard.adminDashboard);

module.exports = admin_router;
