const express = require("express");
const router = express.Router();
const User = require("../models/user");
const books = require("google-books-search");
const ensureLogin = require("connect-ensure-login");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

// for testing dashboard
router.get("/dashboard", (req, res, next) => {
  res.render("User/dashboard", {
    layout: "User/layout"
  });
});

// for testing find-book

var options = {
  key: "",
  field: "title",
  offset: 0,
  limit: 15,
  type: "books",
  // order: "relevance",
  lang: false,
};

router.get("/find-book", (req, res, next) => {
  if (req.query.book) {
    books.search(req.query.book, options, function(error, results) {
      let results3 = results;
      let message = "";
      console.log(results);
      if (results.length === 0) {
        message = "Try Harry Potter";
        results3 = [{ title: "" }];
      }
      if (!error) {
        res.render(
          "User/find-book",
          { results, message, layout: "User/layout" }
        );
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

router.get("/:userid/dashboard", (req, res) => {
  User.find({
    _id: req.params._id
  })
    .then(user => {
      res.render("User/dashboard", {
        user
      });
    })
    .catch(err => {
      console.log(err, "there was an error");
    });
});
// successfully logged in (private routes)

router.get("/dashboard", ensureLogin.ensureLoggedIn("signin"), (req, res) => {
  res.render("User/dashboard", {
    layout: "User/layout",
    title: "Hello, Username"
  });
});

// for testing profile editing
router.get("/editprofile", (req, res, next) => {
  res.render("User/edit-profile", {
    layout: "User/layout",
    title: "Hello, Username"
  });
});

module.exports = router;
