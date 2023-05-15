const jwt = require("jsonwebtoken");

const accessoriesModel = require("../../model/vendor/accessoriesModel");
const cycleModel = require("../../model/vendor/cycleModel");
const cycleBookingModal = require("../../model/user/CycleBookingModal");

const vendorAccessories = async (req, res) => {
  const accessories = await accessoriesModel.find({
    vendor: req.body.vendor,
  });
  res.json({ accessories });
};

const booked = async (req, res) => {
  const { authorization } = req.headers;

  const token = authorization.split(" ")[1];

  const { _id } = jwt.verify(token, process.env.USER_JWT_SECRET);

  const CycleBooked = new cycleBookingModal({
    user: _id,
    vendor: req.body.data.cycle.vendor,
    cycle: req.body.data.cycle._id,
    accessories: req.body.data.accessories,
    amount: req.body.data.totalPrice,
    bookedFromDate: new Date(req.body.data.fromDate),
    bookedToDate: new Date(req.body.data.toDate),
  });

  const booked = await CycleBooked.save();
  if (booked) {
    res.json("booked");
  }

  await cycleModel.findOneAndUpdate(
    { _id: req.body.data.cycle._id },
    {
      $set: {
        bookedFromDate: new Date(req.body.data.fromDate),
        bookedToDate: new Date(req.body.data.toDate),
      },
    }
  );

  req.body.data?.accessories?.forEach(async (element) => {
    await accessoriesModel.findOneAndUpdate(
      { _id: element },
      {
        $set: {
          bookedFromDate: req.body.data.fromDate,
          bookedToDate: req.body.data.toDate,
        },
      }
    );
  });
};

module.exports = {
  vendorAccessories,
  booked,
};
