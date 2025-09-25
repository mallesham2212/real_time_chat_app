const mongoose = require("mongoose");

require("dotenv").config();

const Mongo_URL = process.env.DB_CONNECTION_STRING;
// console.log(Mongo_URL);

const connectDB = async () => {
  await mongoose.mongoose.connect(process.env.DB_CONNECTION_STRING, {});
};

module.exports = connectDB;
