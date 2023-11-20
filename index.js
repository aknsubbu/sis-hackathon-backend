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
const UserSchema = require("./models/UserModel");

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

const authentication = (req, res, next) => {
  if (req.headers.authentication_type === "User") {
    const token = req.headers.authentication_credentials;
    const decoded = jsonwebtoken.verify(token, "SECRET_KEY");
    console.log(decoded);
    if (decoded.role === "User") {
      next();
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } else {
    console.log(req.headers);
    console.log(req.headers.authentication_type);
    res.status(401).json({ message: "Invalid credentials" });
  }
};

app.post("/login", (req, res) => {
  try {
    const { username, password } = req.body;
    UserSchema.find({ username: username }).then((data) => {
      if (data.length == 0) {
        res.status(401).json({ message: "Invalid credentials" });
      } else {
        if (data[0].password == password) {
          const token = jsonwebtoken.sign(
            {
              username: req.body.username,
              role: "admin",
            },
            "SECRET_KEY"
          );
          res.status(200).json({
            token: token,
            authentication: { type: "bearer", credentials: token },
          });
        } else {
          res.status(401).json({ message: "Invalid credentials" });
        }
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
