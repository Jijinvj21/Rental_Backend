const CycleBookingModal = require("../../model/user/CycleBookingModal");

const cycleReturnStatus = async (req, res) => {
  const vendor = await CycleBookingModal.find({ _id: req.body.data });

  if (vendor[0].status) {
    await CycleBookingModal.updateOne(
      { _id: req.body.data },
      { $set: { status: false } }
    );
  } else {
    await CycleBookingModal.updateOne(
      { _id: req.body.data },
      { $set: { status: true } }
    );
  }
};

module.exports = {
  cycleReturnStatus,
};
