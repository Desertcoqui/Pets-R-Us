// <!--
// Title: Assignment 4
// Author: Professor Krasso
// Date: 26 June 20222
// Modified By: Ferdinand "Papo" Detres Jr
// Description: This week's project is Pets R Us
//code came from FMS on bellevue

// -->

const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

let userSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now },
  // email: { type: String },
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
