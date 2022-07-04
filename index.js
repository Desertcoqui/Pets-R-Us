// <!--
// Title: Assignment 4
// Author: Professor Krasso
// Date: 26 June 20222
// Modified By: Ferdinand "Papo" Detres Jr
// Description: This week's project is Pets R Us
// https://www.w3schools.com/Css/
// https://www.w3schools.com/Css/css_background.asp
// https://www.w3schools.com/Css/css_background.asp
//https://www.youtube.com/watch?v=H5K_WGg5rhE

// -->

const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const port = 3000;

const User = require("./models/user");

var connect = "mongodb+srv://papo:WhoCares$8@buwebdev-cluster-1.omearcz.mongodb.net/?retryWrites=true&w=majority";

mongoose
  .connect(CONN)
  .then(() => {
    console.log("Connection to MongoDB database was successful");
  })
  .catch((err) => {
    console.log("MongoDB Error: " + err.message);
  });

//Static Files Images, JS, CSS Styles
app.use(express.static("public"));
app.use("/images", express.static(__dirname + "public/images"));
app.use("/public/images", express.static(__dirname + "/public/images"));
app.use("/js", express.static(__dirname + "public/js"));
app.use("/styles", express.static(__dirname + "public/styles"));
app.use("/styles/site.css", express.static(__dirname + "public/styles/site.css"));

//HTML Routes
app.engine(".html", require("ejs").__express);
app.set("views", "./views");
app.set("view engine", "ejs");

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

//Registration
app.get("/registration", (req, res) => {
  res.render("registration.html");
});

//Listening on port 3000

app.listen(port, () => {
  console.log("Application started and listening on port" + port);
});
