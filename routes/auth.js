const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const {
  signup,
  login,
  isloggedIn,
  isAuthenticated,
  logout,
} = require("../controllers/auth");

//User Sign up
router.post(
  "/signup",
  [
    check("name", "Name should be sting and not empty")
      .not()
      .isEmpty()
      .isString(),
    check("email", "Please Enter correct email").isEmail(),
    check("password", "Password must have 5 characters").isLength({ min: 5 }),
  ],
  signup
);

//User login
router.post(
  "/login",
  [
    check("email", "Please Enter correct email").isEmail(),
    check("password", "Password must not be empty").not().isEmpty(),
  ],
  login
);

//User logout
router.get("/logout", logout);

module.exports = router;
