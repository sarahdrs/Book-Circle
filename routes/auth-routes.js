const express = require("express");
const authRoutes = express.Router();
const passport = require("passport");
const ensureLogin = require("connect-ensure-login");
const User = require("../models/user");

// Add bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

// signup route

authRoutes.get("/", (req, res, next) => {
  res.render("/signup");
});

authRoutes.post("/", (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

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
        password: hashPass
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
    successRedirect: "/User/dashboard",
    failureRedirect: "/",
    failureFlash: true,
    passReqToCallback: true
  })
);

// successfully logged in (private route)


// authRoutes.get(
//   "/User/dashboard",
//   ensureLogin.ensureLoggedIn("signin"),
//   (req, res) => {
//     res.render("User/dashboard", { user: req.email });
//   }
// );


// logout route
authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/signin");
});

module.exports = authRoutes;
