const { trusted } = require("mongoose");
const userModel = require("../../model/user/userModel");

const user_Display = async (req, res) => {
  const userData = await userModel.find();
  res.json(userData);
};

const userStatus_Update = async (req, res) => {
  if (req.body.status) {
    const update = await userModel.updateOne(
      { _id: req.body._id },
      { $set: { status: false } }
    );
    res.status(200).json("USER BLOCKED");
  } else {
    const update = await userModel.updateOne(
      { _id: req.body._id },
      { $set: { status: true } }
    );
    res.status(200).json("USER UNBLOCKED");
  }
};
module.exports = {
  user_Display,
  userStatus_Update,
};
