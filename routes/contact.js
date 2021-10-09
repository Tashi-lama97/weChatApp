const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const { getUserById } = require("../controllers/user");
const { isloggedIn, isAuthenticated } = require("../controllers/auth");
const { addContact, getAllUserContacts } = require("../controllers/contact");

//Getting userifo
router.param("userId", getUserById);

//Add contact
router.post(
  "/contact/add/:userId",
  isloggedIn,
  isAuthenticated,
  [check("contactId", "Contact Id should not be empty").not().isEmpty()],
  addContact
);

//Fetching contact list
router.get(
  "/get/all/contacts/:userId",
  isloggedIn,
  isAuthenticated,
  getAllUserContacts
);

module.exports = router;
