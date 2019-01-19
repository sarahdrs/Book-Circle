// routes/auth-routes.js
const express = require("express");
const authRoutes = express.Router();

// User model
const User = require("../models/user");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

//signup & signin
authRoutes.get("/", (req, res, next) => {
  res.render("/");
});

authRoutes.post("/", (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  if (email === "" || password === "") {
    console.log("no email and PW entered")
    res.render("index", {
      message: "Please enter your email address and password"
    });
    return;
  }

  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  const newUser = new User({
    email,
    password: hashPass
  });

  newUser.save(err => {
    if (err) {
      res.render("/", { message: "Please try again, something went wrong" });
    } else {
      res.redirect("/");
    }
  });
});

module.exports = authRoutes;
