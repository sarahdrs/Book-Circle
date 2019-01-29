const express = require("express");
const router = express.Router();
const User = require("../models/user");
const books = require("google-books-search");
const ensureLogin = require("connect-ensure-login");
const axios = require("axios");

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
    books.search(req.query.book, options, function (error, results) {
      let results3 = results;
      let message = "";
      console.log(results);
      if (results.length === 0) {
        message = "Try Harry Potter";
        results3 = [{
          title: ""
        }];
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
  books.lookup(bookID, function (error, result) {
    console.log("THE BOOK IS " + result.title);
    res.render("User/book-details", {
      result,
      message,
      layout: "User/layout"
    });
  });
});

router.post("/book-details/:bookid",
  ensureLogin.ensureLoggedIn("signin"),
  (req, res, next) => {
    const userID = req.user._id;
    console.log("Der User ist " + userID);
    let bookID = req.params.bookid
    console.log("Das ist die Book ID " + bookID);
    User.findOneAndUpdate({
        _id: userID
      }, {
        $push: {
          favorites: bookID
        }
      }, {
        safe: true,
        upsert: true
      },
      function (err, doc) {
        if (err) {
          console.log(err);
        } else {
          //do stuff
        }
      }
    );
    books.lookup(bookID, function (error, result) {
    res.render("User/book-details", {
      result,
      layout: "User/layout"
    });
  })
  })

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

// router.post(
//   "/editprofile",
//   ensureLogin.ensureLoggedIn("signin"),
//   (req, res) => {
//     User.findOne({ name: req.user.firstname }, function(err, User) {
//       (User.firstname = req.body.firstname),
//         (User.lastname = req.body.lastname),
//         (User.description = req.body.description);
//     }).then(User.save());
//     console.log(req.user).then(() => {
//       res.render("User/edit-profile", {
//         user: req.user,
//         layout: "User/layout",
//         title: "Hi," + req.user.firstname
//       });
//     });
//   }
// );

router.post(
  "/editProfile",
  ensureLogin.ensureLoggedIn("signin"),
  (req, res) => {
    User.findById(req.user._id, function (err, user) {
      if (!user) {
        return res.redirect("/edit");
      } else {
        var firstname = req.body.firstname;
        var lastname = req.body.lastname;
        var description = req.body.description;

        user.firstname = firstname;
        user.lastname = lastname;
        user.description = description;
      }
      user.save(function (err) {
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