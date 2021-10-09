const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const messageSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      trim: true,
    },
    sender: {
      type: ObjectId,
      ref: "User",
    },
    reciver: {
      type: ObjectId,
      ref: "User",
    },
    chatId: {
      type: String,
      trim: true,
    },
    unread: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Message", messageSchema);
