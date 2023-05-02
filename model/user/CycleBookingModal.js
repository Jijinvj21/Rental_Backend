const mongoose = require("mongoose");

const bookingSchema = mongoose.Schema({
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "user",
  },
  vendor: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "vendor",
  },
  cycle: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "cycle",
  },
  accessories: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "accessories",
    },
  ],
  amount: {
    type: Number,
  },
  bookedFromDate: {
    type: String,
  },
  bookedToDate: {
    type: String,
  },
  status: {
    type: Boolean,
    default: true,
  },
});
module.exports = mongoose.model("booking", bookingSchema);
