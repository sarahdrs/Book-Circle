const express = require("express");
const router = express.Router();
const User = require("../models/user");
const books = require('google-books-search');

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
  field: 'title',
  offset: 0,
  limit: 10,
  type: 'books',
  // order: 'relevance',
};

router.get("/find-book", (req, res, next) => {
  if (req.query.book){
    books.search(req.query.book, options, function (error, results) {
      let results3 = results
      let message = ""
      console.log(results)
      if (results.length === 0) {
        message = "Try Harry Potter"
        results3 = [{title: ""}]
      }
      if (!error) {
        res.render('User/find-book', {items: results3[0].items, message},
        // {layout: "User/layout"}
        )
  
      } else {
        console.log(error);
      }
    })
  }
  else {res.render("User/find-book", {
    layout: "User/layout"
  });}
});

// // implement book search from npm package 
// router.get('/book-details', (req, res) => {
//   books.search(req.query.book, function (error, results) {
//     if (!error) {
//       let items = results[0].items
//       res.render('User/book-details', {items: results})

//       console.log(results);
//     } else {
//       console.log(error);
//     }
//   })
// })

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





module.exports = router;