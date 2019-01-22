const express = require("express");
const router = express.Router();
const User = require("../models/user");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

// for testing dashboard
router.get("/dashboard", (req, res, next) => {
  res.render("User/dashboard", {layout:"User/layout"});
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





module.exports = router;