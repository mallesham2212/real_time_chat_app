const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

require("dotenv").config();

const protectRoute = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(404).json({ message: "No Token Provided" });
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decode) {
      return res.status(404).json({ message: "Please Login" });
    }
    const { _id } = decode;

    if (!_id) {
      return res.status(404).json("User not exist");
    }
    const user = await User.findById({ _id: _id });
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    console.log(error);
    return res.status(501).json("error in Auth protect route");
  }
};

module.exports = { protectRoute };
