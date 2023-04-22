const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    adminId: {
      type: String,
    },
    member: {
      type: Array,
},

  },
  {
    timestamps: true,
  }
);

module.exports  = mongoose.model("Conversation", conversationSchema);




