const express = require("express");
const router = express.Router();
const User = require("../models/user");
const books = require("google-books-search");
const ensureLogin = require("connect-ensure-login");
const axios = require("axios");
const uploadCloud = require("../config/cloudinary.js");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

//find-book

// var options = {
//   key: "",
//   field: "title",
//   offset: 0,
//   limit: 15,
//   type: "books",
//   order: "relevance",
//   lang: false
// };

router.get("/find-book", (req, res, next) => {
  let searchFilter= req.body.filter;
  console.log("SEARCH FILTER: " + searchFilter)
  let options = {
    key: "",
    field: searchFilter,
    offset: 0,
    limit: 15,
    type: "books",
    order: "relevance",
    lang: false
  };
  if (req.query.book) {
    books.search(req.query.book, options, function(error, results) {
      let results3 = results;
      let message = "";

      if (results.length === 0) {
        message = "No books found? Try Harry Potter :-)";
        results3 = [
          {
            title: ""
          }
        ];
      }
      if (!error) {
        res.render("User/find-book", {
          results,
          message,
          layout: "User/layout"
        });
      } else {
        console.log(error);
      }
    });
  } else {
    res.render("User/find-book", {
      layout: "User/layout"
    });
  }
});

router.get("/book-details/:bookid/:booktitle", (req, res, next) => {
  let bookID = req.params.bookid;
  let bookTitle = req.params.booktitle;
  let message = "";
  console.log("THE ID IS: " + bookID);
  books.lookup(bookID, function(error, result) {
    console.log("THE BOOK IS " + result.title);
    res.render("User/book-details", {
      result,
      message,
      layout: "User/layout"
    });
  });
});

router.post(
  "/book-details/:bookid/:booktitle/",
  ensureLogin.ensureLoggedIn("signin"),
  (req, res, next) => {
    const userID = req.user;
    console.log("Der User ist " + userID);
    let bookID = req.params.bookid;
    let bookTitle = req.params.booktitle;

    console.log("Das ist die Book ID " + bookID);
    console.log("das ist der buchtitel" + bookTitle);

    if (req.query.favorite === "1") {
      req.user.updateFavorites(bookID, bookTitle);
    } else if (req.query.read === "1") {
      req.user.updateLibrary(bookID, bookTitle);
    }

    books.lookup(bookID, function(error, result) {
      res.render("User/book-details", {
        result,
        layout: "User/layout"
      });
    });
  }
);

router.get("/find-user", (req, res, next) => {
  let searchName = req.query.user;
  let regexSearch = { $regex: new RegExp(`.*${searchName}.*`), $options: "i" };
  User.find(
    { $or: [{ firstname: regexSearch }, { lastname: regexSearch }] },
    function(err, userResults) {
      res.render("User/find-user", {
        userResults,
        layout: "User/layout"
      });
    }
  );
});

router.get("/user-details", (req, res, next) => {
  let bookID = req.params.bookid;


// router.post("/find-user/:id", (req, res) => {
//   let followeeID = req.query.id;
//   console.log("FOLOWEE ID: " + followeeID);
//   res.render("User/find-user")

// })

//dashboard
router.get("/dashboard", ensureLogin.ensureLoggedIn("signin"), (req, res) => {
  console.log("REQ USER", req.user._id);

  res.render("User/dashboard", {
    user: req.user,
    layout: "User/layout",
    title: "Hello, " + req.user.firstname + "!"
  });
});

// for testing profile editing
router.get("/editprofile", ensureLogin.ensureLoggedIn("signin"), (req, res) => {
  res.render("User/edit-profile", {
    user: req.user,
    layout: "User/layout",
    title: "Hi," + req.user.firstname
  });
});

router.post(
  "/editProfile",
  ensureLogin.ensureLoggedIn("signin"),
  uploadCloud.single("profilepicture"),
  (req, res) => {
    User.findById(req.user._id, function(err, user) {
      if (!user) {
        return res.redirect("/edit");
      } else {
        var firstname = req.body.firstname;
        var lastname = req.body.lastname;
        var description = req.body.description;
        var picture = req.file.url;

        user.firstname = firstname;
        user.lastname = lastname;
        user.description = description;
        user.picture = picture;
      }
      user.save(function(err) {
        if (err) {
          res.redirect("/editprofile");
        } else {
          res.redirect("/dashboard");
        }
      });
    });
  }
);

module.exports = router;
