const { cloudinary } = require("../lib/store");
const Messages = require("../models/message.model");
const User = require("../models/user.model");

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

    const sentMessage = await message.save();

    // realtime functionality

    return res.status(200).json(sentMessage);
  } catch (error) {
    console.error("error in sendMessageController", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getMessagesController = async (req, res) => {
  try {
    const receiverId = req.params.id;
    const loggedInUser = req.user;
    const myId = loggedInUser._id;
    const allMessage = await Messages.find({
      $or: [
        { senderId: myId, receiverId: receiverId },
        { senderId: receiverId, receiverId: myId },
      ],
    });
    res.status(200).json({ allMessage });
  } catch (error) {
    return res.status(501).json("Internal server error");
  }
};

const getAllUsers = async (req, res) => {
  try {
    const { _id } = req.user;
    const allUser = await User.find({ _id: { $ne: _id } });
    res.status(200).json({ allUser });
  } catch (error) {
    console.log(error);
    return res.status(501).json("Internal server error", error);
  }
};

module.exports = { sendMessageController, getMessagesController, getAllUsers };
