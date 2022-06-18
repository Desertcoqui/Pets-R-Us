const express = require("express");
const app = express();

const PORT = process.env.Port || 3000;

app.get("/", (req, res) => {
  res.send("We are up and running");
});

app.listen(PORT, () => {
  console.log("Application started and listening on port" + PORT);
});

app.engine('.html',require('ejs')._express);

app.set('views',path.join(/views/index.html,'views'));
app.set('views',path.join(/views/grooming.html,'views'));

app.set('view engine','html');