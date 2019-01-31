const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstname: String,
  lastname: String,
  email: String,
  password: String,
  picture: String,
  description: String,
  favorites: [],
  library:[],
  friends: [
    {
      id: String
    }
  ]
});

const User = mongoose.model("User", userSchema);

module.exports = User;
