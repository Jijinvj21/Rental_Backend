const vendorModel = require("../../model/vendor/vendorModule");
const vendor_Display = async (req, res) => {
  const vendorData = await vendorModel.find();
  res.json(vendorData);
};

const vendorStatus_Update = async (req, res) => {
  if (req.body.status) {
    const update = await vendorModel.updateOne(
      { _id: req.body._id },
      { $set: { status: false } }
    );
    res.status(200).json("VENDOR BLOCKED");
  } else {
    const update = await vendorModel.updateOne(
      { _id: req.body._id },
      { $set: { status: true } }
    );
    res.status(200).json("VENDOR UNBLOCKED");
  }
};
module.exports = {
  vendor_Display,
  vendorStatus_Update,
};
