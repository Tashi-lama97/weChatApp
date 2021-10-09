const Message = require("../models/message");
const { validationResult } = require("express-validator");

//Storing Message
exports.storeMessage = (data) => {
  //checking if message is for new conversation
  const message = new Message({
    message: data.message,
    sender: data.sender,
    reciver: data.reciver,
    chatId: data.chatId,
    unread: true,
  });
  message.save((error, data) => {
    if (error) {
      return error;
    }
  });
};

exports.readChat = (req, res) => {
  const { chatId } = req.params;
  Message.updateMany({ chatId: chatId }, { $set: { unread: false } }).exec(
    (error, data) => {
      if (error) {
        return res.status(422).json({
          error,
        });
      }

      res.status(200).json({
        success: true,
      });
    }
  );
};

//Getting message History
exports.getMessageHistory = (req, res) => {
  Message.aggregate([
    {
      $match: {
        //filtering data based on requesting user id
        $or: [{ sender: req.userInfo._id }, { reciver: req.userInfo._id }],
      },
    },

    {
      $group: {
        //grouping data  based on chat id to avoid dublicate recent chats
        _id: {
          chatId: "$chatId",
        },
        sender: { $last: "$sender" },
        reciver: { $last: "$reciver" },
        message: { $last: "$message" },
        date: { $last: "$createdAt" },
        unread: { $last: "$unread" },
      },
    },

    {
      //getting data for sender info from another table
      $lookup: {
        from: "users",
        localField: "sender",
        foreignField: "_id",
        as: "senderInfo",
      },
    },
    {
      //getting data for reciver info from another table
      $lookup: {
        from: "users",
        localField: "reciver",
        foreignField: "_id",
        as: "reciverInfo",
      },
    },
    {
      //selecting data for output
      $project: {
        _id: 1,
        message: 1,
        date: 1,
        reciver: 1,
        sender: 1,
        unread: 1,
        "senderInfo.name": 1,
        "reciverInfo.name": 1,
      },
    },
    {
      $sort: {
        date: -1,
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

exports.getAllMessagesBySenderAndReciver = (req, res) => {
  // const error = validationResult(req);
  // if (!error.isEmpty()) {
  //   return res.status(422).json({ error: error });
  // }

  Message.aggregate([
    {
      $match: {
        // matching multiple conditions to get whole conversation between two users
        chatId: req.params.chatId,
      },
    },
    // {
    //   $skip: req.body.skip,
    // },
    // { $limit: req.body.limit },

    {
      //selecting data for output
      $project: {
        _id: 1,
        message: 1,
        sender: 1,
        reciver: 1,
        createdAt: 1,
      },
    },
    {
      $sort: { createdAt: -1 },
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

//Delete Message
exports.deleteMassage = (req, res) => {
  //Checking for error
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(422).json(error);
  }
  Message.deleteOne({ _id: req.body.messageId }).exec((error, data) => {
    if (error || !data) {
      return res.status(400).json({
        error: "Unable to Delete Message",
      });
    } else {
      return res.status(200).json({
        message: "Message Scussfully Deleted",
      });
    }
  });
};

exports.getChatId = (req, res) => {
  const { userId, reciver } = req.params;
  Message.findOne({
    $or: [
      { $and: [{ reciver: reciver }, { sender: userId }] },
      { $and: [{ reciver: userId }, { sender: reciver }] },
    ],
  }).exec((error, data) => {
    if (error) {
      return res.status(400).json({
        error: error,
      });
    } else {
      return res.status(200).json(data);
    }
  });
};
