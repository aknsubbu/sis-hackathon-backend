const express = require("express");
const morgan = require("morgan");
const jsonwebtoken = require("jsonwebtoken");
const bodyParser = require("body-parser");
require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(morgan("dev"));

const port = process.env.PORT || 3000;

const databaseurl = process.env.DATABASE_URL;

mongoose.connect(databaseurl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("connected", () => {
  console.log("Mongoose is connected!!!!");
});

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the API",
  });
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
