const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstname: String,
  lastname: String,
  email: String,
  password: String,
  picture: { type: String, default: "" },
  description: String,
  favorites: [],
  library: [],
  _friends: [{ type: Schema.Types.ObjectId, ref: "User" }]
});

userSchema.methods.updateFriends = function updateFriends(friendID) {
  return this.update(
    {
      $addToSet: {
        _friends: friendID
      }
    },
    {
      safe: true,
      upsert: true
    },
    function(err, doc) {
      if (err) {
        console.log(err);
      } else {
        //do stuff
      }
    }
  );
};

userSchema.methods.updateFavorites = function updateFavorites(
  bookID,
  bookTitle
) {
  this.update(
    {
      $addToSet: {
        favorites: {
          id: bookID,
          title: bookTitle,
          picture:
            "https://books.google.de/books/content?id=" +
            bookID +
            "&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE72rI1Euhs9deYuyLPQQUme5L1PqEW6740WJ81iemxo8UJaJsxp20lADyo6s6kc3xsSvYR96uVKrBNgDW58IEGYoyRDEOJUJmFKQjdHXK5bPXy1KjgQVmq8cFRZ_Ll_1hpCAbybR"
        }
      }
    },
    {
      safe: true,
      upsert: true
    },
    function(err, doc) {
      if (err) {
        console.log(err);
      } else {
        //do stuff
      }
    }
  );
};

userSchema.methods.updateLibrary = function updateLibrary(bookID, bookTitle) {
  this.update(
    {
      $addToSet: {
        library: {
          id: bookID,
          title: bookTitle,
          picture:
            "https://books.google.de/books/content?id=" +
            bookID +
            "&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE72rI1Euhs9deYuyLPQQUme5L1PqEW6740WJ81iemxo8UJaJsxp20lADyo6s6kc3xsSvYR96uVKrBNgDW58IEGYoyRDEOJUJmFKQjdHXK5bPXy1KjgQVmq8cFRZ_Ll_1hpCAbybR"
        }
      }
    },
    {
      safe: true,
      upsert: true
    },
    function(err, doc) {
      if (err) {
        console.log(err);
      } else {
        //do stuff
      }
    }
  );
};

const User = mongoose.model("User", userSchema);

module.exports = User;
