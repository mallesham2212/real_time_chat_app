const express = require("express");
const dotenv = require("dotenv");
const { authRouter } = require("./routes/auth.routes.js");
const connectDB = require("./config/conncetDB.js");
const cookieParser = require("cookie-parser");
const { messageRouter } = require("./routes/message.route.js");

dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT;
app.use("/api/auth", authRouter);
app.use("/api/messages", messageRouter);
app.get("/hii", (req, res) => {
  res.send("hiii");
});

connectDB()
  .then(() => {
    console.log("conncted to database");
    app.listen(PORT, (req, res) => {
      console.log("Server is running on PORT :", PORT);
    });
  })
  .catch((err) => {
    console.log("data base is not connected");
  });
