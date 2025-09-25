const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
      validate(val) {
        if (!validator.isEmail(val)) {
          throw new Error("Email is not correct");
        }
      },
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      minlength: 6,
      required: true,
    },
    profilePic: {
      type: String,
      default: " ",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
