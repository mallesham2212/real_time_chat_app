const express = require("express");
const { protectRoute } = require("../middlewares/auth.protect");
const {
  sendMessageController,
  getMessagesController,
  getAllUsers,
} = require("../controllers/message.controller");

const messageRouter = express.Router();

messageRouter.post("/sendMessage/:id", protectRoute, sendMessageController);
messageRouter.get("/getMessages/:id", protectRoute, getMessagesController);
messageRouter.get("/getUsers", protectRoute, getAllUsers);

module.exports = { messageRouter };
