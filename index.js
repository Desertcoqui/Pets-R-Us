// <!--
// Title: Assignment 4
// Author: Professor Krasso
// Date: 19 June 20222
// Modified By: Ferdinand "Papo" Detres Jr
// Description: This week's project is Pets R Us
// https://www.w3schools.com/Css/
// https://www.w3schools.com/Css/css_background.asp
// https://www.w3schools.com/Css/css_background.asp
// -->

const express = require("express");

const app = express();
const port = 3000;

//Static Files Images, JS, CSS Styles
app.use(express.static("public"));
app.use("/images", express.static(__dirname + "public/images"));
app.use("/js", express.static(__dirname + "public/js"));
app.use("/styles", express.static(__dirname + "public/styles"));
app.use("/styles/site.css", express.static(__dirname + "public/styles/site.css"));

//HTML Routes
app.engine(".html", require("ejs").__express);
app.set("views", "./views");
app.set("view engine", "html");

app.get("", (req, res) => {
  res.render("index");
});

app.get("/grooming", (req, res) => {
  res.render("grooming.html");
});

//Listening on port 3000

app.listen(port, () => {
  console.log("Application started and listening on port" + port);
});
