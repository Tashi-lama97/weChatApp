require("dotenv").config();

const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*",
  },
});
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { v4: uuidv4 } = require("uuid");

//All Routes import
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/message");
const contactRoutes = require("./routes/contact");
const userRoutes = require("./routes/user");
const { storeMessage } = require("./controllers/message");

// DB conection
mongoose
  .connect(process.env.MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("DB Connected");
  })
  .catch((err) => {
    console.log(err);
  });

//Middlewares
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());

//Routes
app.use("/api", authRoutes);
app.use("/api", messageRoutes);
app.use("/api", contactRoutes);
app.use("/api", userRoutes);
app.get("/", (req, res) => {
  res.send("server is running");
});

io.on("connection", (socket) => {
  console.log("User Online");
  socket.on("join", ({ chat_id }, callback) => {
    try {
      socket.join(chat_id);
    } catch (error) {
      if (error) {
        return callback(error);
      }
    }
  });
  socket.on("leaveChat", ({ chatId }, callback) => {
    try {
      socket.leave(chatId);
    } catch (error) {
      return callback(error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User Offline");
  });

  socket.on("sendMessage", (data, callback) => {
    try {
      io.to(data.chatId).emit("message", data);
      io.emit("updateChatHistory", data);
      storeMessage(data);
    } catch (error) {
      return callback(error);
    }
  });
});

//Port
port = process.env.PORT || 5000;

if (process.env.NODE_ENV == "production") {
  app.use(express.static("client/build"));
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

//Strarting Server
server.listen(port, () => {
  console.log(`APP is running on port ${port}`);
});
