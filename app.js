require("dotenv").config();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const favicon = require("serve-favicon");
const hbs = require("hbs");
const mongoose = require("mongoose");
const logger = require("morgan");
const path = require("path");
const index = require("./routes/index");
const authRoutes = require("./routes/auth-routes");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const bcrypt = require("bcrypt");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user");
const books = require("google-books-search");
const jquery = require("jquery");
var FacebookStrategy = require('passport-facebook').Strategy;

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true
  })
  .then(x => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch(err => {
    console.error("Error connecting to mongo", err);
  });


const app_name = require("./package.json").name;
const debug = require("debug")(
  `${app_name}:${path.basename(__filename).split(".")[0]}`
);

const flash = require("connect-flash");

const app = express();

app.use(flash());

app.use(
  session({
    secret: "stupid",
    store: new MongoStore({
      mongooseConnection: mongoose.connection
    })
    //resave: true,
    //saveUninitialized: true
  })
);

passport.serializeUser((user, cb) => {
  cb(null, user._id);
});

passport.deserializeUser((id, cb) => {
  User.findById(id, (err, user) => {
    if (err) {
      return cb(err);
    }
    cb(null, user);
  });
});

passport.use(
  new LocalStrategy({
    usernameField: "email"
  }, (param1, password, next) => {
    User.findOne({
      email: param1
    }, (err, user) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return next(null, false, {
          message: "Incorrect username"
        });
      }
      if (!bcrypt.compareSync(password, user.password)) {
        return next(null, false, {
          message: "Incorrect password"
        });
      }

      return next(null, user);
    });
  })
);

passport.use(new FacebookStrategy({
    clientID: process.env['FACEBOOK_CLIENT_ID'],
    clientSecret: process.env['FACEBOOK_CLIENT_SECRET'],
    callbackURL: '/signin/facebook/callback',
    profileFields: ['id','displayName','photos','emails']
  },
  (accessToken, refreshToken, profile, cb) => {
    User.findOne({
      facebookId: profile.id,
    }).then((user) => {
      if (user === null) {
        console.log("RESPONSE FROM FACEBOOK", profile)
        let userName = profile.displayName.split(" ")
        User.create({
          facebookId: profile.id,
          firstname:userName[0],
          lastname:userName[1],
          picture: profile.photos[0].value,
        }).then((user) => {
          return cb(null, user);
        }).catch((err) => {
          return cb(err, null);
        })

      } else {
        return cb(null, user);
      }
    })
      console.log("Das ist der firstname:" + profile.displayName)
      console.log("RESPONSE FROM FACEBOOK", profile.photos[0].value)
  }))

app.use(passport.initialize());
app.use(passport.session());

// Middleware Setup
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: true
}));

var Handlebars = hbs;
Handlebars.registerHelper("limit", function(arr, limit) {
  if (!Array.isArray(arr)) {
    return [];
  }
  return arr.slice(-3);
});

// Express View engine setup

app.use(
  require("node-sass-middleware")({
    src: path.join(__dirname, "public"),
    dest: path.join(__dirname, "public"),
    sourceMap: true
  })
);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));

// default value for title local
app.locals.title = "Book-Circle";

// Routes middleware goes here
app.use("/", index);
app.use("/", authRoutes);

module.exports = app;