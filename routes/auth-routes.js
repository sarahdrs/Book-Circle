const express = require("express");
const authRoutes = express.Router();
const passport = require("passport");
const ensureLogin = require("connect-ensure-login");
const User = require("../models/user");
const multer = require("multer");
const uploadCloud = require("../config/cloudinary.js");

// Add bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

// signup route

authRoutes.get("/", (req, res, next) => {
  res.render("/");
});

// const upload = multer({ dest: "./public/uploads" });

authRoutes.post("/", uploadCloud.single("profilepicture"), (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const picture = req.file.url;
  // const picture = `/uploads/${req.file.filename}`;
  console.log(req.file.filename);

  if (email === "" || password === "") {
    res.render("index", {
      message: "Please enter your email address and password."
    });
    return;
  }

  User.findOne({ email })
    .then(existinguser => {
      if (existinguser !== null) {
        res.render("index", {
          message: "This email address is already registered."
        });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        email,
        password: hashPass,
        firstname,
        lastname,
        picture
      });

      newUser.save(err => {
        if (err) {
          res.render("index", {
            message: "Ooops, something went wrong.Please try again."
          });
        } else {
          res.redirect("/signin");
        }
      });
    })
    .catch(error => {
      next(error);
    });
});

// signin route

authRoutes.get("/signin", (req, res, next) => {
  res.render("signin");
});

authRoutes.post(
  "/signin",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/",
    failureFlash: true,
    passReqToCallback: true
  })
);

// logout route
authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = authRoutes;
