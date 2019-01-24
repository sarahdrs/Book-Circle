const express = require("express");
const router = express.Router();
const User = require("../models/user");
const ensureLogin = require("connect-ensure-login");


/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

// successfully logged in (private routes)

router.get(
  "/dashboard",
  ensureLogin.ensureLoggedIn("signin"),
  (req, res) => {
    res.render("User/dashboard", {
      layout: "User/layout",
      title: "Hello, Username"
    });
  }
);

// for testing dashboard
// router.get("/dashboard", (req, res, next) => {
//   res.render("User/dashboard", {
//     layout: "User/layout",
//     title: "Hello, Username"
//   });
// });

// for testing profile editing
router.get("/editprofile", (req, res, next) => {
  res.render("User/edit-profile", {
    layout: "User/layout",
    title: "Hello, Username"
  });
});

// router.get("/dashboard", (req, res) => {
//   User.find({
//     _id: req.params._id
//   })
//     .then(user => {
//       res.render("User/dashboard", {
//         user
//       });
//     })
//     .catch(err => {
//       console.log(err, "there was an error");
//     });
// });

module.exports = router;
