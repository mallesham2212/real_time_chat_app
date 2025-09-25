const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
require("dotenv").config();

const protectRoute = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(404).json("Please Login");
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decode) {
      return res.status(404).json("UnAuthorized Token");
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
    return res.status(501).json("Internal server error");
  }
};

module.exports = { protectRoute };
