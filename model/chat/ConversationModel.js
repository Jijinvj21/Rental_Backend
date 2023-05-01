const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
  adminId: {
    type: String,
  },
  member: {
    type: mongoose.SchemaTypes.ObjectId,
    ref:'user',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("Conversation", conversationSchema);
