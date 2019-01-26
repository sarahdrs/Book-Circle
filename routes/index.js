const express = require("express");
const router = express.Router();
const User = require("../models/user");
const books = require("google-books-search");
const ensureLogin = require("connect-ensure-login");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

//find-book

var options = {
  key: "",
  field: "title",
  offset: 0,
  limit: 15,
  type: "books",
  order: "relevance",
  lang: false
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

router.get("/book-details/:bookid", (req, res, next) => {
  let bookID = req.params.bookid;
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

// successfully logged in (private routes)

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

// router.post("/editprofile", ensureLogin.ensureLoggedIn("signin") => {
//     req.user
//       .updateOne(
//         (req.user.Router_id = req.params._id),
//         (req.user.firstname = req.body.firstname),
//         (req.user.lastname = req.body.lastname),
//         (req.user.description = req.body.description)
//       )
//       .then(req.user.save())
//       // console
//       //   .log(req.user)
//       .then(() => {
//         res.render("User/edit-profile", {
//           user: req.user,
//           layout: "User/layout",
//           title: "Hi," + req.user.firstname
//         });
//       });
//   }
// );
module.exports = router;
