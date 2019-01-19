const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const authorSchema = new Schema({
  name: String,
  books: [
    {
      id: String
    }
  ]
});

const Author = mongoose.model("author", authorSchema);

module.exports = Author;
