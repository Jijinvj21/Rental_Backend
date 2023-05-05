const twilio = require("../../util/twilio");
const userModel = require("../../model/user/userModel");
const vendorModel = require("../../model/vendor/vendorModule");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const vendorCreateToken = (_id) => {
  return jwt.sign({ _id }, process.env.VENDOR_JWT_SECRET, { expiresIn: "1d" });
};
const userCreateToken = (_id) => {
  return jwt.sign({ _id }, process.env.USER_JWT_SECRET, { expiresIn: "1d" });
};

// login
const login = async (req, res) => {
  try {
    if (req.body.type === "User") {
      const user = await userModel.findOne({ phone: req.body.mobile });
      if (user) {
        if (user.status) {
          await twilio.sendVerificationToken(req.body.mobile);
          res.status(201).json({ data: "user found" });
        } else {
          res.status(401).json({ data: "You are blocked by Admin" });
        }
      } else {
        res.status(401).json({ data: "Check your Credentials" });
      }
    } else if (req.body.type === "Vendor") {
      const vendor = await vendorModel.findOne({ phone: req.body.mobile });
      if (vendor) {
        if (vendor.status) {
          // const data = await twilio.sendVerificationToken(req.body.mobile)
          let data = true;
          if (data) {
            res.status(201).json({ data: "logged" });
          }
        } else {
          res.status(401).json({ data: "You are blocked by Admin" });
        }
      } else {
        res.status(401).json({ data: "Check your Credentials" });
      }
    }
  } catch (error) {
    console.log(error);
  }
};
// otp verify
const VerifyOtp = async (req, res) => {
  try {
    const str = req.body.user.pathname;
    const arr = str.split("/").filter(Boolean);
    const otp = req.body.OTP;
    const phoneNumber = req.body.user.state.mobile;
    // const data = await twilio.checkVerificationToken(otp, phoneNumber)
    const data = true;
    if (arr[0] === "User" && arr[1] === "Signup") {
      if (data) {
        const user = new userModel({
          name: req.body.user.state.name,
          phone: req.body.user.state.mobile,
        });
        await user.save();
        res.status(201).json({ data: "user/signup" });
      } else {
        res.status(401).json({ data: "CHECK YOUR OTP" });
      }
    } else if (arr[0] === "Vendor" && arr[1] === "Signup") {
      if (data) {
        const vendor = new vendorModel({
          name: req.body.user.state.name,
          phone: req.body.user.state.mobile,
        });
        await vendor.save();
        res.status(201).json({ data: "vendor/signup" });
      } else {
        res.status(401).json({ data: "CHECK YOUR OTP" });
      }
    } else if (arr[0] === "Vendor" && arr[1] === "Login") {
      if (data) {
        const vendor = await vendorModel.findOne({ phone: phoneNumber });
        if (vendor) {
          const token = vendorCreateToken(vendor._id);
          const data = {
            token,
            from: "vendor/login",
            vendorData: vendor,
          };

          res.status(201).json({ data });
        }
      } else {
        res.status(401).json({ data: "CHECK YOUR OTP" });
      }
    } else if (arr[0] === "User" && arr[1] === "Login") {
      if (data) {
        const user = await userModel.findOne({ phone: phoneNumber });
        if (user) {
          const token = userCreateToken(user._id);
          const data = {
            token,
            from: "user/login",
            userData: user,
          };

          res.status(201).json({ data });
        }
      } else {
        res.status(401).json({ data: "CHECK YOUR OTP" });
      }
    }
  } catch (error) {
    console.log(error);
  }
};
//signup
const signup = async (req, res) => {
  try {
    if (req.body.type === "User") {
      const user = await userModel.findOne({ phone: req.body.user.mobile });
      if (user) {
        res.status(401).json({ data: "User Exist" });
      } else {
        await twilio.sendVerificationToken(req.body.user.mobile);
        res.status(201).json({ data: "User Register" });
      }
    } else if (req.body.type === "Vendor") {
      const vendor = await vendorModel.findOne({ phone: req.body.user.mobile });
      if (vendor) {
        res.status(401).json({ data: "Vendor Exist" });
      } else {
        await twilio.sendVerificationToken(req.body.user.mobile);
        res.status(201).json({ data: "Vendor Registered" });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  login,
  VerifyOtp,
  signup,
};
