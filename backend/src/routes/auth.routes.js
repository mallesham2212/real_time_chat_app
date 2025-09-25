const express = require("express");
const {
  signupController,
  loginController,
  logoutController,
  updateProfile,
  check,
} = require("../controllers/auth.controller");
const { protectRoute } = require("../middlewares/auth.protect");

const authRouter = express.Router();

authRouter.post("/signup", signupController);

authRouter.post("/login", loginController);

authRouter.post("/logout", logoutController);

authRouter.post("/updateprofile", protectRoute, updateProfile);

authRouter.get("/check", protectRoute, check);

module.exports = { authRouter };
