const User = require("../models/user");
const { validationResult } = require("express-validator");

//Getting user by id for authentication
exports.getUserById = (req, res, next, id) => {
  User.findById(id).exec((error, user) => {
    if (error || !user) {
      return res.status(404).json({
        error: "User Not Found",
      });
    }
    req.userInfo = user;
    next();
  });
};

//getting reciver id for getting all messages
exports.getReciverIdById = (req, res, next, id) => {
  User.findById(id).exec((error, user) => {
    if (error || !user) {
      return res.status(404).json({
        error: "User Not Found",
      });
    }
    req.reciverId = user._id;
    next();
  });
};

//getting user by email for contact search
exports.getUserByEmail = (req, res) => {
  const email = req.body.email;
  User.findOne({ email: email }).exec((error, data) => {
    if (error || !data) {
      return res.status(404).json({
        error: "User Not Found",
      });
    } else {
      return res.status(200).json({
        user_id: data._id,
        user_name: data.name,
        user_email: data.email,
      });
    }
  });
};
