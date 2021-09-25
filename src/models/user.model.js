const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
    trim: true,
  },

  deviceId: {
    type: String,
    trim: true,
    required: false,
    unique: true,
    lowercase: true,
  },
  lastTimelineDate: {
    type: String,
    default: "0",
  },
  timelines: {
    type: Array,
    required: false,
    default: [],
  },

  token: {
    type: String,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
