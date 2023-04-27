const user = require('../../model/user/userModel')
const booking = require('../../model/user/CycleBookingModal')
const cycle = require('../../model/vendor/cycleModel')


const adminDashboard = async (req, res) => {
    const userData =await user.find()
    const cycleData =await cycle.find()
    let tru = await booking.countDocuments({ status: true })
    let fal = await booking.countDocuments({ status: false })
    const dd = await booking.aggregate([
        {
          $group: {
            _id: null,
            totalAmount: { $sum: "$amount" }
          }
        }
      ]);
      
      if (dd.length > 0) {
    //     console.log(dd[0].totalAmount);
    //     console.log('countof booked :'+fal);
    //   console.log('count return :' +tru);
    //   console.log('count of cycle:' + cycleData.length); 
    //   console.log('count of user:' + userData.length); 
      let data={
        totalRevinew :dd[0].totalAmount,
        returnCount:fal,
        bookedCount:tru,
        cycleCount:cycleData.length,
        userCount:userData.length
      }
      res.json({data:data})
console.log(data);
      } else {
        console.log("No booking data found");
      }
      
   
      

}




module.exports = {
    adminDashboard
}

