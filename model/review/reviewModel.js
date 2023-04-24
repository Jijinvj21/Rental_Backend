const mongoose = require("mongoose")

const reviewSchema = mongoose.Schema({
    user:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'user',
    },
    product:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'cycle',
    },
    stars: {
        type: Number
    },
    message: {
        type: String
    },
    status: {
        type: Boolean,
        default:true
    },
  
})

module.exports = mongoose.model("review", reviewSchema)