const mongoose = require("mongoose")

const cycleSchema = mongoose.Schema({
    vendor:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'vendor',
        required: [true, "Ventor id is required"]
    },
    image: {
        type: String,
        required: [true, "image is required"]
    },
    speed: {
        type: Number,
        required: [true, "Speed is required"]
    },
    type: {
        type: String,
        required: [true, "Type is required"],
    },
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    breaks: {
        type: String,
        required: [true, "Break is required"],
    },
    tyreSize: {
        type: Number,
        required: [true, "Tyre Size is required"],
    },
    quantity: {
        type: Number,
        required: [true, "Quantity is required"],
    },
    priceinclude: {
        type: String,
        required: [true, "Price Include Items is required"],
    },
    securityDeposit: {
        type: Number,
        required: [true, "Security Deposit is required"],
    },
    terms: {
        type: String,
        required: [true, "Terms is required"],
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

module.exports = mongoose.model("cycle", cycleSchema)