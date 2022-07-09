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

// -->

const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const mongoose = require("mongoose");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const csrf = require("csurf");
const csurfProtection = csrf({ cookie: true });
const app = express();

//mongoose import
const User = require("./models/user.js");

const port = 3000;
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

//HTML Routes
app.engine(".html", require("ejs").__express);
app.set("views", "./views");
app.set("view engine", "ejs");

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

app.get("/form", csurfProtection, function (req, res) {
  // pass the csrfToken to the view
  res.render("send", { csrfToken: req.csrfToken() });
});

//Helmet method that prevents cross-site scripting
app.use(helmet.xssFilter());

//Forms and JSON objects
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
//Login Page
app.get("/login", (req, res) => {
  res.render("login.html");
});

//Listening on port 3000

app.listen(port, () => {
  console.log("Application started and listening on port" + port);
});

//Registration Form Post
app.post("/registration", csurfProtection, (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;

  User.register(new User({ username: username, email: email }), password, function (err, user) {
    if (err) {
      console.log(err);
      return res.redirect("/registration");
    }

    passport.authenticate("local")(req, res, function () {
      res.redirect("/registration");
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
      });
    }
  });
});

//Login/Logout
app.post(
  "/login",
  csurfProtection,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
  }),
  function (req, res) {}
);

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});
