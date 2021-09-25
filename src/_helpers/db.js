const mongoose = require("mongoose");

const MONGODB_URL = "mongodb://127.0.0.1:27017/ludo-api";
//const MONGODB_URL =
// "mongodb+srv://amit1234:Nsit_delhi3@cluster0.d7rgz.mongodb.net/kho-api?retryWrites=true&w=majority";

mongoose.connect(MONGODB_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
});
mongoose.Promise = global.Promise;

module.exports = {
  User: require("../models/user.model"),
  Timeline: require("../models/timeline.model"),
  Leaderboard: require("../models/leaderboard.model"),
};
