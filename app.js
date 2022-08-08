// <!--
// Title: Assignment 4
// Author: Professor Krasso
// Date: 8 July 20222
// Modified By: Ferdinand "Papo" Detres Jr
// Description: This week's project is Pets R Us
// https://www.w3schools.com/Css/
// https://www.w3schools.com/Css/css_background.asp
// https://www.w3schools.com/Css/css_background.asp
//https://www.youtube.com/watch?v=H5K_WGg5rhE
//https://www.youtube.com/watch?v=SQqSMDIzhaE
//https://www.securecoding.com/blog/using-helmetjs/
//https://expressjs.com/en/resources/middleware/csurf.html
//https://medium.com/passportjs/fixing-session-fixation-b2b68619c51d
//https://codedec.com/tutorials/logout-using-passport-module-in-node-js/

// -->

const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const mongoose = require("mongoose");
const helmet = require("helmet");
const whatsTheDeal = require("alert");
const bodyParser = require("body-parser");
const csrf = require("csurf");
const csurfProtection = csrf({ cookie: true });
const app = express();
const fs = require("fs");
const http = require("http");

//mongoose import models
const User = require("./models/user.js");
const Schedule = require("./models/schedule.js");
const { db } = require("./models/user.js");
const schedule = require("./models/schedule.js");

// const port = 3000;
var CONN = "mongodb+srv://papo:WhoCares$8@buwebdev-cluster-1.omearcz.mongodb.net/testDB?retryWrites=true&w=majority";

//Mongoose connection
mongoose
  .connect(CONN)
  .then(() => {
    console.log("Connection to MongoDB database was successful");
  })
  .catch((err) => {
    console.log("MongoDB Error: " + err.message);
  });

//template engine
app.engine(".html", require("ejs").__express);
app.set("views", "./views");
app.set("view engine", "ejs");
app.set("port", process.env.PORT || 8080);

//server
/* Create server */
http.createServer(app).listen(app.get("port"), function () {
  console.log("Application started on port " + app.get("port"));
});

//Static Files Images, JS, CSS Styles
app.use(express.static("public"));
app.use("/images", express.static(__dirname + "public/images"));
app.use("/public/images", express.static(__dirname + "/public/images"));
app.use("/js", express.static(__dirname + "public/js"));
app.use("/styles", express.static(__dirname + "public/styles"));
app.use("/styles/site.css", express.static(__dirname + "public/styles/site.css"));
//MiddleWare
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cookieParser());

//CSRF
app.use(csurfProtection);
app.use((req, res, next) => {
  const token = req.csrfToken();
  res.cookie("XSRF-TOKEN", token);
  res.locals.csrfToken = token;
  next();
});

//Helmet method that prevents cross-site scripting
app.use(helmet.xssFilter());

//Express
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: "s3cret",
    resave: true,
    saveUninitialized: true,
  })
);

//Passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});
//localhost:3000 default

app.get("", (req, res) => {
  res.render("index.html");
});

//Grooming Page
app.get("/grooming", (req, res) => {
  res.render("grooming.html");
});
//Landing Page
app.get("/index", (req, res) => {
  res.render("index.html");
});
//Boarding Page
app.get("/boarding", (req, res) => {
  res.render("boarding.html");
});
//Training Page
app.get("/training", (req, res) => {
  res.render("training.html");
});
//Booking Page
app.get("/booking", isLoggedIn, (req, res, next) => {
  let servicesJsonFile = fs.readFileSync("./public/data/services.json");
  let services = JSON.parse(servicesJsonFile);
  res.render("booking.html", {
    services,
  });
});

app.post("/booking", isLoggedIn, (req, res, next) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const service = req.body.service;
  const email = req.body.email;

  let newSchedule = new Schedule({
    firstName,
    lastName,
    service,
    email,
  });
  whatsTheDeal("Thanks for Scheduling your appointment ");
  newSchedule.save();
  res.redirect("/index");
});

//get array of user info
app.get("/appointment", isLoggedIn, async (req, res) => {
  schedule.find({}, function (err, newAppointment) {
    if (err) {
      console.log(err);
    } else {
      res.json(newAppointment);
    }
  });
});
//profile
app.get("/profile", isLoggedIn, async (req, res) => {
  let username = req.session.passport.user;
  let email = req.user.email;
  res.locals.currentUser = username;
  schedule.findOne({ email: email }, function (err, appointment) {
    if (err) {
      console.log(err);
    } else {
      res.render("profile.html", {
        appointment: appointment,
        email: email,
        username: username,
      });
    }
    console.log(email);
    console.log(appointment);
  });
});

app.post("/profile", (req, res) => {
  const userProfile = {
    username: currentUser.username,
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  };
  console.log(userProfile);
});
//Login Page
app.get("/login", (req, res) => {
  res.render("login.html", { csrfToken: req.csrfToken() });
});
//Logout

//Listening on port 3000/wiring up express server

// app.listen(port, () => {
//   console.log("Application started and listening on port" + port);
// });

//Registration Form Post
app.post("/registration", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;

  User.register(new User({ username: username, email: email }), password, function (err, user) {
    if (err) {
      console.log(err);
      return res.redirect("/registration");
    }

    passport.authenticate("local")(req, res, function () {
      res.redirect("/index");
    });
  });
});
//Registration Form Get
app.get("/registration", (req, res) => {
  User.find({}, function (err, users) {
    if (err) {
      console.log(err);
    } else {
      res.render("registration.html", {
        users: users,
        csrfToken: req.csrfToken(),
      });
    }
  });
});

//log in/out

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
  }),
  function (req, res) {}
);
app.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    whatsTheDeal("Woof Woof! Please Log in/ or register first");
    res.redirect("/index");
  }
}
