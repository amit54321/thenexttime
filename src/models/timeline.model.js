const mongoose = require("mongoose");

const schema = mongoose.Schema({
  timeline: {
    type: String,
    required: true,
    trim: true,
  },
  mode: {
    type: Number,
    default: 0,
  },
  stage2Start: {
    type: Number,
    required: false,
    default: 0,
  },
  stage3Start: {
    type: Number,
    required: false,
    default: 0,
  },
  stage4Start: {
    type: Number,
    required: false,
    default: 0,
  },
  stage5Start: {
    type: Number,
    required: false,
    default: 0,
  },
  date: {
    type: String,
    default: "0",
  },
});

schema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("Timeline", schema);
