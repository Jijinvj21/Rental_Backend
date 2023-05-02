const mongoose = require("mongoose");

const vendorSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  phone: {
    type: Number,
    required: [true, "Phone is required"],
    unique: true,
  },
  userType: {
    type: String,
    required: true,
    default: "Vendor",
  },
  status: {
    type: Boolean,
    required: true,
    default: true,
  },
});

module.exports = mongoose.model("vendor", vendorSchema);
