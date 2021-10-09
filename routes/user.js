const express = require("express");
const router = express.Router();
const { getUserById, getUserByEmail } = require("../controllers/user");
const { isloggedIn, isAuthenticated } = require("../controllers/auth");

//Getting userInfo
router.param("userId", getUserById);

//Contact search
router.post(
  "/search/user/:userId",
  isloggedIn,
  isAuthenticated,
  getUserByEmail
);

module.exports = router;
