const jwt = require("jsonwebtoken");
const userModel = require('../model/user/userModel')
const cycleModel = require('../model/vendor/cycleModel')
const vendorModel = require('../model/vendor/vendorModule')
const accessoriesModel = require('../model/vendor/accessoriesModel')
const CycleBookingModel = require('../model/user/CycleBookingModal')



const filter = async (req, res) => {
  let db
  try {
    const dataSelect = req.body.data
    const fromDate = new Date(req.query.fromDate);
          const toDate = new Date(req.query.toDate);
  
      switch (dataSelect) {
        case 'user':
          db = userModel
          break
        case 'cycle':
          db = cycleModel
          break
        case 'vendor':
          db = vendorModel
          break
        case 'accessories':
          db = accessoriesModel
          break
          case 'booking':
          db = CycleBookingModel
          break
        default:
          break
      }
      let page = parseInt(req.query.page) - 1 || 0
      let limit = parseInt(req.query.limit) || 5
      let search = req.query.search || ''
      let sort = req.query.sort || 'rating'
      req.query.sort ? (sort = req.query.sort.split(',')) : (sort = [sort])
      let sortBy = {}
      if (req.query.order) {
        sortBy[sort[0]] = req.query.order === 'desc' ? -1 : 1
      } else {
        sortBy[sort[0]] = 1
      }
      let user
      if (dataSelect === "accessories"   ) {
        const { authorization } = req.headers;
        const token = authorization.split(" ")[1];
        if(req.query.tokenOf === "vendor"){
          let  { _id } = jwt.verify(token, process.env.VENDOR_JWT_SECRET );
    
         user = await db.find({vendor:_id ,  name: { $regex: search, $options: "i" } })
          .sort(sortBy)
          .skip(page * limit)
          .limit(limit)
        }else{
          res.status(401).json('server error')
        }
      } else {
        if(req.query.state){
          
        
user = await db.find({
  status: req.query.state,
  name: { $regex: search, $options: "i" },
  $and: [
      { bookedFromDate: { $not: { $elemMatch: { $lte: toDate } } } },
      { bookedToDate: { $not: { $elemMatch: { $gte: fromDate } } } }
  ]
})
.sort(sortBy)
.skip(page * limit)
.limit(limit);
          
        }else{

        


if( dataSelect !== "booking" ){

  user = await db.find({ name: { $regex: search, $options: "i" } } )
  .sort(sortBy)
    .skip(page * limit)
    .limit(limit)
}else{



            if(req.query.tokenOf === "vendor" ){
              const { authorization } = req.headers;
              const token = authorization.split(" ")[1];
              let  {_id}= jwt.verify(token, process.env.VENDOR_JWT_SECRET );
              user = await CycleBookingModel.find({ vendor :_id} )
              .populate('user')
              .populate('vendor')
              .populate('cycle')
              .populate('accessories')
                      .sort(sortBy)
                .skip(page * limit)
                .limit(limit)
            }else if(req.query.tokenOf === "user_order") {

              const { authorization } = req.headers;
              const token = authorization.split(" ")[1];
              let  {_id}= jwt.verify(token, process.env.USER_JWT_SECRET );
              user = await CycleBookingModel.find({ user :_id})
              .populate('user')
              .populate('vendor')
              .populate('cycle')
              .populate('accessories')
                      .sort(sortBy)
                .skip(page * limit)
                .limit(limit)

            }else{
              user = await CycleBookingModel.find()
              .populate('user')
              .populate('vendor')
              .populate('cycle')
              .populate('accessories')
                      .sort(sortBy)
                .skip(page * limit)
                .limit(limit)
            }
            
          }
            
        }
      }



let total
      if (dataSelect === "accessories"  ) {
        const { authorization } = req.headers;
  const token = authorization.split(" ")[1];
  if(req.query.tokenOf === "vendor"){

    let { _id } = jwt.verify(token, process.env.VENDOR_JWT_SECRET );
    total = await db.countDocuments({vendor:_id , name: { $regex: search, $options: 'i' }})
   }else{
     res.status(401).json(' Server error')
   }
      } else {
if(req.query.state){

  total = await db.countDocuments({
    status: req.query.state,
    name: { $regex: search, $options: 'i' },
    $and: [
        { bookedFromDate: { $not: { $elemMatch: { $lte: toDate } } } },
        { bookedToDate: { $not: { $elemMatch: { $gte: fromDate } } } }
    ],
    createdAt: {
        $gte: fromDate,
        $lte: toDate,
    }
});

}else{


if(dataSelect !== "booking"){
  total = await db.countDocuments({ name: { $regex: search, $options: 'i' }})
}else{
  if(req.query.tokenOf === 'vendor'){
    const { authorization } = req.headers;
              const token = authorization.split(" ")[1];
              let  {_id}= jwt.verify(token, process.env.VENDOR_JWT_SECRET );
              total = await CycleBookingModel.countDocuments({ vendor :_id})
             
  }else if(req.query.tokenOf === 'user_order'){
    const { authorization } = req.headers;
    const token = authorization.split(" ")[1];
    let  {_id}= jwt.verify(token, process.env.USER_JWT_SECRET );
    total = await CycleBookingModel.countDocuments({ user :_id})
  }else{
    total = await CycleBookingModel.countDocuments()
   
  }
}
}
      }
      const response = {
        error: false,
        total,
        page: page + 1,
        limit,
        user
      }
      res.json(response)
  } catch (error) {
    console.log(error)
    res.status(401).json('server error')
  }
}

module.exports = {
  filter
}
