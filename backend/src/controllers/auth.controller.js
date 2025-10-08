const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const { cloudinary } = require("../lib/store");
require("dotenv").config();

const signupController = async (req, res) => {
  try {
    const { email, fullName, password } = req.body;
    if (!email || !fullName || !password) {
      return res.status(401).json("All the fields are required");
    }
    if (password.length < 6) {
      return res.status(400).json("Password should not be less than 6");
    }
    const isUserExist = await User.find({ email: email });
    if (!isUserExist) {
      return res.status(401).json("you have signed up Please Login");
    }
    const passWordHash = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      fullName,
      password: passWordHash,
    });

    const LoggedInUser = await newUser.save();
    const token = jsonwebtoken.sign(
      { _id: LoggedInUser._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({ LoggedInUser });
  } catch (error) {
    return res.status(501).json("Internal server error");
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json("All fields are required");
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json("Invalid Credintials");
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json("Invalid Credintials");
    }
    const token = jsonwebtoken.sign(
      { _id: user._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    res.status(200).json(user);
  } catch (error) {
    return res.status(501).json("Internal server error");
  }
};

const logoutController = (req, res) => {
  try {
    res.cookie("token", null, { expires: new Date(Date.now()) });
    res.status(200).json("succesfully logged out");
  } catch (error) {
    return res.status(501).json("Internal server error");
  }
};

const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;
    if (!profilePic) {
      return res.status(400).json({ message: "Profile pic is required" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json({ updatedUser });
  } catch (error) {
    console.error("error in update profile", error);
    res.status(501).json("Internal server error");
  }
};

const check = async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json(user);
  } catch (error) {
    return res.status(501).json("Please Login");
  }
};

module.exports = {
  signupController,
  loginController,
  logoutController,
  updateProfile,
  check,
};
