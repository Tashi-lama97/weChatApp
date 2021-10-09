const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const contactSchema = new mongoose.Schema({
  contact: {
    type: ObjectId,
    ref: "User",
    required: true,
  },
  user: {
    type: ObjectId,
    ref: "User",
    required: true,
  },
});
module.exports = mongoose.model("Contact", contactSchema);
