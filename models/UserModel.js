const mongoose = require("mongoose");

//username and password
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    min: 6,
    max: 20,
  },
  password: {
    type: String,
    required: true,
    min: 6,
    max: 20,
  },
});

module.exports = mongoose.model("User", UserSchema);
