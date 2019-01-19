const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  title: String,
  author: String,
  coverpicture: String,
  description: String,
  genre: String,
  description: String,
  releasedate: Date,
  ISBN: String
});

const Book = mongoose.model("book", bookSchema);

module.exports = Book;
