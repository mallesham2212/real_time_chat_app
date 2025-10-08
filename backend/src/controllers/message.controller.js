const { getSocketOfReceiver } = require("../config/socket");
const { cloudinary } = require("../lib/store");
const Messages = require("../models/message.model");
const User = require("../models/user.model");
const { io } = require("../config/socket");

const sendMessageController = async (req, res) => {
  try {
    const { text, image } = req.body;

    if (!text && !image) {
      return res.status(400).json({ message: "Please send a text or image" });
    }

    const receiverId = req.params.id;
    const myId = req.user._id;

    let imageUrl;
    if (image) {
      const response = await cloudinary.uploader.upload(image);
      imageUrl = response.secure_url;
    }

    const message = new Messages({
      senderId: myId,
      receiverId,
      text,
      image: imageUrl,
    });

    await message.save();

    // realtime functionality

    const receiverSocketId = getSocketOfReceiver(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", message);
    }

    return res.status(200).json(message);
  } catch (error) {
    console.error("error in sendMessageController", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getMessagesController = async (req, res) => {
  try {
    const receiverId = req.params.id;
    const senderId = req.user._id;

    const allMessages = await Messages.find({
      $or: [
        { senderId: senderId, receiverId: receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      allMessages,
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const { _id } = req.user;
    const allUsers = await User.find({ _id: { $ne: _id } });
    res.status(200).json(allUsers);
  } catch (error) {
    console.log(error);
    return res.status(501).json("Internal server error", error);
  }
};

module.exports = { sendMessageController, getMessagesController, getAllUsers };
