const mongoose = require("mongoose")

const accessoriesSchema = mongoose.Schema({
    vendor:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'vendor',
        required: [true, "Ventor id is required"]
    },
    image: {
        type: String,
        required: [true, "image is required"]
    },
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    size: {
        type: Number,
        required: [true, "Size is required"],
    },
    quantity: {
        type: Number,
        required: [true, "Quantity is required"],
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
    },
    status: {
        type: Boolean,
        required: true,
        default: true,
    },
    bookedFromDate:{
        type:Array,
    },
    bookedToDate:{
        type:Array,
    },
    
})
module.exports = mongoose.model("accessories", accessoriesSchema)