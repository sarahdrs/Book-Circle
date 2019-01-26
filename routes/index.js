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
  console.log("THE ID IS: " + bookID)
books.lookup(bookID, function(error, result) {
  console.log("THE BOOK IS " + result.title)
   res.render("User/book-details", {
    result,
    message,
    layout: "User/layout"
  });

});
})


 router.post("/book-details",ensureLogin.ensureLoggedIn("signin"), (req,res,next) => {
   const userID = req.user
   console.log("Der User ist" + userID)
   document.getElementById("save-book").onclick = function(){
     const bookID = result.bookid
     console.log("Das ist die Book ID" + bookID)
     User.findByIdAndUpdate(userID, { $push: { favorites: bookID }},  {safe: true, upsert: true},
      function(err, doc) {
          if(err){
          console.log(err);
          }else{
          //do stuff
          }
      }
  );
   }
   res.render("User/book-details", {
    layout: "User/layout"
  });
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
router.get("/editprofile", (req, res, next) => {
  res.render("User/edit-profile", {
    layout: "User/layout",
    title: "Hello, Username"
  });
});

module.exports = router;
