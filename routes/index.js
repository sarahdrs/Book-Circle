const express = require("express");
const router = express.Router();
const User = require("../models/user");
const books = require("google-books-search");
const ensureLogin = require("connect-ensure-login");
const axios = require("axios");
const uploadCloud = require("../config/cloudinary.js");
const jquery = require ("jquery")

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/find-book", (req, res, next) => {
  let searchFilter = req.query.filter;
  console.log("SEARCH FILTER: " + searchFilter);
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
    books.search(req.query.book, options, function (error, results) {
      let results3 = results;
      let message = "";

      if (results.length === 0) {
        message = "No books found? Try Harry Potter :-)";
        results3 = [{
          title: ""
        }];
      }
      if (!error) {
        res.render("User/find-book", {
          results,
          message,
          layout: "User/layout",
          title: "Find books",
          left: "Dashboard"
        });
      } else {
        console.log(error);
      }
    });
  } else {
    res.render("User/find-book", {
      layout: "User/layout",
      title: "Find books",
      left: "Dashboard"
    });
  }
});

router.get("/book-details/:bookid/:booktitle", (req, res, next) => {
  let bookID = req.params.bookid;
  let bookTitle = req.params.booktitle;
  let message = "";
  console.log("THE ID IS: " + bookID);
  books.lookup(bookID, function (error, result) {
    console.log("THE BOOK IS " + result.title);
    res.render("User/book-details", {
      result,
      message,
      layout: "User/layout",
      left: "Your Dashboard"
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

    books.lookup(bookID, function (error, result) {
      res.render("User/book-details", {
        result,
        layout: "User/layout",
        left: "Dashboard"
      });
    });
  }
);
// $(document).ready(() => {
// axios.post('/book-details/:bookid/:booktitle/', ensureLogin.ensureLoggedIn("signin"))
//   .then(result => {
//     const userID = result.user;
//     console.log("Der User ist " + userID);
//     let bookID = result.params.bookid;
//     let bookTitle = result.params.booktitle;
//     console.log("Das ist die Book ID " + bookID);
//     console.log("das ist der buchtitel" + bookTitle);
//     if (req.query.favorite === "1") {
//       req.user.updateFavorites(bookID, bookTitle);
//     } else if (req.query.read === "1") {
//       req.user.updateLibrary(bookID, bookTitle);
//     }

//   })})
  





router.get("/find-user", (req, res, next) => {
  let searchName = req.query.user;
  let regexSearch = {
    $regex: new RegExp(`.*${searchName}.*`),
    $options: "i"
  };
  User.find({
      $or: [{
        firstname: regexSearch
      }, {
        lastname: regexSearch
      }]
    },
    function (err, userResults) {
      res.render("User/find-user", {
        userResults,
        layout: "User/layout",
        title: "Find other readers",
        left: "Dashboard"
      });
    }
  );
});

router.get("/user-details/:userid/", (req, res, next) => {
  let foloweeID = req.params.userid;
  User.findById(foloweeID, function (err, foloweeResults) {
    res.render("User/user-details", {
      foloweeResults,
      layout: "User/layout",
      title: "Reader´s details",
      left: "Dashboard"
    });
  });
});

router.post("/user-details/:friendid/:firstname", (req, res, next) => {
  const userID = req.user;
  console.log("user", req.user);
  const friendID = req.params.friendid;
  const firstname = req.params.firstname;
  req.user.updateFriends(friendID).then(() => {
    User.findById(friendID, function (err, foloweeResults) {
      res.render("User/user-details", {
        foloweeResults,
        layout: "User/layout"
      });
    });
  });
});

//dashboard
router.get("/dashboard", ensureLogin.ensureLoggedIn("signin"), (req, res) => {
  User.findById(req.user)
    .populate("_friends")
    .then(completeObject => {
      res.render("User/dashboard", {
        user: req.user,
        completeObject,
        layout: "User/layout",
        title: "Hello, " + req.user.firstname + "!"
      });
    });
});

// START HENDRIKS CODE
// //dashboard
// router.get("/dashboard", ensureLogin.ensureLoggedIn("signin"), (req, res) => {

//   let completeObject;

//   User.findById(req.user)
//     .populate("_friends")
//     .then(completeObjectRes => {
//       completeObject = completeObjectRes;
//       requestsArr = []

//       // for each friend ...
//       completeObject._friends.forEach((friend) => {

//         friend.googlePopulatedFavorites = []

//         // for the first 3 favorites
//         friend.favorites.slice(-3).forEach((favorite) => {

//           // books.lookup() --> wrap this into a Promise
//           let promise = new Promise(function(resolve, reject) {
//             books.lookup(favorite.id, (error, result) => {
//               // self-implemented populate (here: populate from Google Books API)
//               friend.googlePopulatedFavorites.push(result)
//               resolve()
//             })
//           });
//           requestsArr.push(promise)

//         })
//       })

//       // wait for all requests to Google Books to be answered
//       return Promise.all(requestsArr)
//     }).then(() => {

//       res.render("User/dashboard", {
//         user: req.user,
//         completeObject,
//         layout: "User/layout",
//         title: "Hello, " + req.user.firstname + "!"
//       });

//     })
// });
// END HENDRIKS CODE

// for testing profile editing
router.get("/editprofile", ensureLogin.ensureLoggedIn("signin"), (req, res) => {
  res.render("User/edit-profile", {
    user: req.user,
    layout: "User/layout",
    title: "Hi," + req.user.firstname,
    left: "Dashboard"
  });
});

router.post(
  "/editProfile",
  ensureLogin.ensureLoggedIn("signin"),
  uploadCloud.single("profilepicture"),
  (req, res) => {
    User.findById(req.user._id, function (err, user) {
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