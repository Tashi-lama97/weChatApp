const mongoose = require("mongoose");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      maxlength: 32,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    secure_password: {
      type: String,
      required: true,
    },
    salt_key: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema
  .virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt_key = uuidv4();
    this.secure_password = this.createSecurePass(password);
  })
  .get(function () {
    return this._password;
  });
userSchema.methods = {
  authenticate: function (simple_password) {
    return this.createSecurePass(simple_password) === this.secure_password;
  },
  createSecurePass: function (simple_password) {
    if (!simple_password) return "";

    try {
      return crypto
        .createHmac("sha256", this.salt_key)
        .update(simple_password)
        .digest("hex");
    } catch (error) {
      return error;
    }
  },
};
module.exports = mongoose.model("User", userSchema);
