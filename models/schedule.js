// <!--
// Title: Assignment 4
// Author: Professor Krasso
// Date: 17 July 20222
// Modified By: Ferdinand "Papo" Detres Jr
// Description: This week's project is Pets R Us
//code came from FMS on bellevue

// -->

const mongoose = require("mongoose");

let scheduleSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now },
  firstName: { type: String },
  lastName: { type: String },
  service: { type: String },
  email: { type: String },
});

module.exports = mongoose.model("Schedule", scheduleSchema);
