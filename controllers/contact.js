const Contact = require("../models/contact");
const { validationResult } = require("express-validator");

//Adding contact
exports.addContact = (req, res) => {
  //Checking for error
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(422).json({ error: error });
  }

  //Checking if contact already exits in users contact list
  Contact.findOne({
    user: req.userInfo._id,
    contact: req.body.contactId,
  }).exec((error, data) => {
    if (error || !data) {
      //Creating new contact
      const contact = new Contact({
        contact: req.body.contactId,
        user: req.userInfo._id,
      });
      contact.save((error, data) => {
        if (error) {
          return res.status(400).json({
            error: "Unable to Add Contact",
          });
        } else {
          return res.status(200).json(data);
        }
      });
    } else {
      return res.status(404).json({
        error: "Contact Already Exits",
      });
    }
  });
};

//Getting contact list of user
exports.getAllUserContacts = (req, res) => {
  Contact.aggregate([
    {
      //filtering for requested user only
      $match: { user: req.userInfo._id },
    },
    {
      //getting information from other table
      $lookup: {
        from: "users",
        localField: "contact",
        foreignField: "_id",
        as: "contactDetails",
      },
    },
    {
      $project: {
        //selecting data for output
        "contactDetails.name": 1,
        "contactDetails._id": 1,
      },
    },
  ]).exec((error, data) => {
    if (error) {
      return res.status(400).json({
        error: "Unable to fetch data",
      });
    } else {
      return res.status(200).json(data);
    }
  });
};
