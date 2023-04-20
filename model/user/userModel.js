const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    phone: {
        type: Number,
        required: [true, "Phone is required"],
        unique: true
    },
    userType: {
        type: String,
        required: true,
        default: 'User',
    },
    image: {
        type: String
    },
    status: {
        type: Boolean,
        required: true,
        default: true,
    },
})

module.exports = mongoose.model("user", userSchema)