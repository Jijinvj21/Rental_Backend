const booking = require("../../model/user/CycleBookingModal");
const cycle = require("../../model/vendor/cycleModel");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");

const vendorDashboard = async (req, res) => {
  const { authorization } = req.headers;
  const token = authorization.split(" ")[1];
  let { _id } = jwt.verify(token, process.env.VENDOR_JWT_SECRET);
  const bookingData = await booking.countDocuments({ vendor: _id });
  const cycleData = await cycle.find({ vendor: _id });
  let tru = await booking.countDocuments({ vendor: _id ,status:true});
  let fal = await booking.countDocuments({ vendor: _id ,status:false});

  const dd = await booking.aggregate([
    {
      $match: { vendor: new ObjectId(_id) },
    },
    {
      $group: {
        _id: "$vendor",
        totalAmount: { $sum: "$amount" },
      },
    },
  ]);
  if (dd.length > 0) {
    console.log(fal);
    console.log(tru)
    let data = {
      totalRevinew: dd[0].totalAmount,
      returnCount: fal,
      bookedCount: tru,
      cycleCount: cycleData.length,
      bookingCycleCount: bookingData,
    };
    res.json({ data: data });
  } else {
    console.log("No booking data found");
  }
};

module.exports = {
  vendorDashboard,
};
