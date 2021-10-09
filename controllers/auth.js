const User = require("../models/user");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const { validationResult } = require("express-validator");

//SignUp
exports.signup = (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(422).json({ error: error });
  }

  //Checking if user already exits
  User.findOne({ email: req.body.email }).exec((error, data) => {
    if (error || !data) {
      //Creating new user
      const user = new User(req.body);
      user.save((error, data) => {
        if (error) {
          return res.status(400).json({
            error: "Unable to save user",
          });
        }
        data.secure_password = null;
        data.salt_key = null;
        return res.status(200).json(user);
      });
    } else {
      return res.status(409).json({
        error: "User Already exits",
      });
    }
  });
};

//Login
exports.login = (req, res) => {
  //Checking for error
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(422).json({ error: error });
  }
  //Finding User
  User.findOne({ email: req.body.email }).exec((error, user) => {
    if (error || !user) {
      return res.status(404).json({
        error: "User not Found Please register your email",
      });
    } else {
      //Checking password
      if (user.authenticate(req.body.password)) {
        //Creating token
        const token = jwt.sign({ _id: user._id }, process.env.SECRET);
        //Settingup the cookies
        res.cookie("token", token, { expire: new Date() + 1000 });
        //sending response to frontend
        const { _id, name, email } = user;
        res.status(200).json({
          token,
          user: { _id, name, email },
        });
      } else {
        return res.status(401).json({
          error: "User Password does not matched",
        });
      }
    }
  });
};

//logout
exports.logout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "User signout successfully",
  });
};

//Auth middlewares
exports.isloggedIn = expressJwt({
  secret: process.env.SECRET,
  userProperty: "auth",
  algorithms: ["HS256"],
});

exports.isAuthenticated = (req, res, next) => {
  let checker = req.userInfo && req.auth && req.userInfo._id == req.auth._id;
  if (!checker) {
    return res.status(403).json({
      error: "Access Denied",
    });
  }
  next();
};
