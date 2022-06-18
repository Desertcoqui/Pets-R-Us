const express = require("express");
const app = express();
const port = 3000;

//Static Files Images, JS, CSS Styles
app.use(express.static("public"));
app.use("/images", express.static(__dirname + "public/images"));
app.use("/js", express.static(__dirname + "public/js"));
app.use("/styles", express.static(__dirname + "public/img"));

//HTML routes

app.get("", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});
//Listening on port 3000

app.listen(port, () => {
  console.log("Application started and listening on port" + port);
});
