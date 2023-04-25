const reviewModel = require("../model/review/reviewModel")
const booked = require("../model/user/CycleBookingModal")
const jwt = require("jsonwebtoken");

const userBooked = async (req, res) => {
    try {
        let token =  req.body.token
        const {_id} =  jwt.verify(token, process.env.USER_JWT_SECRET);
     const userBooked = await booked.find({
        cycle:req.body.cycle,
        user:_id
    })
    console.log(userBooked.length);
     if(userBooked.length){
        res.json(userBooked)
     }else{
        res.status(401).json('user not booked the cycle')
     }
    } catch (error) {
        console.log(error);
    }
}

const addReview = async (req, res) => {
    try {
       let token =  req.body.token
     const {_id} =  jwt.verify(token, process.env.USER_JWT_SECRET);
        const addreview = new reviewModel ({
            user:_id,
            product:req.body.product,
            stars:req.body.stars,
            message:req.body.message 
        })
        const added = await addreview.save()
        if(added){
            res.json('review added')
        }else{
            res.status(401).json('review not added')

        }
    } catch (error) {
        console.log(error);
    }
   
}

const getReviews = async (req, res) => {
    try {
        console.log(req.body.productId);
     const getReview = await reviewModel.find({product:req.body.productId, status:true}).populate('user')
     console.log(getReview);
     if(getReview){
        res.json(getReview)
     }else{
        res.status(401).json('there is no review')
     }
    } catch (error) {
        console.log(error);
    }
}

const getUserReview = async (req, res) => {
    let token =  req.body.token
     const {_id} =  jwt.verify(token, process.env.USER_JWT_SECRET);
    try {
     const getUserReview = await reviewModel.find({
        product:req.body.productId,
        user:_id
    })
     if(getUserReview.length ){
        res.json(getUserReview)
     }else{
        res.status(401).json('there is no review')
     }
    } catch (error) {
        console.log(error);
    }
}

const editReview = async (req, res) => {
   console.log(req.body);
   try {
    const rev =  await reviewModel.find({_id:'64469fa374a494b5176c7c9d'})

       console.log(rev);
    const editReview = await reviewModel.updateMany({
      _id:req.body.rating.id
    },{$set:{
        stars:req.body.rating.starRating,
        message:req.body.rating.review 
    }})
    console.log(editReview);
    if(editReview){
      res.json(editReview)
    }else{
      res.status(401).json('mongodb error')
    }
  } catch (error) {
    console.log(error);
    res.status(500).json('server error');
  }
}

const blockReview = async (req, res) => {
    console.log(req.body);
    try {
    const review = await reviewModel.find({ _id: req.body.id })
    console.log(review);
    if (review[0].status) {
       await reviewModel.updateOne({ _id: req.body.id }, { $set: { status: false } })
       res.json('false')
    } else {
        await reviewModel.updateOne({ _id: req.body.id }, { $set: { status: true } })
        res.json('true')
    }
    } catch (error) {
        console.log(error);
    }
}

const getReviewOfUser = async (req, res) => {
    let token =  req.body.token
    const {_id} =  jwt.verify(token, process.env.USER_JWT_SECRET);
    console.log(143);
    console.log(_id);
    console.log(143);
   try {
    const getReviewOfUser = await reviewModel.find({
       user:_id
   }).populate('product')
    if(getReviewOfUser.length ){
       res.json(getReviewOfUser)
    }else{
       res.status(401).json('there is no review')
    }
   } catch (error) {
       console.log(error);
   }
}

module.exports = {
    userBooked,
    addReview,
    getReviews,
    getUserReview,
    editReview,
    blockReview,
    getReviewOfUser

}