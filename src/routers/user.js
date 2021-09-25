const express = require("express");
const board = require("./board");

const db = require("../_helpers/db");
const router = express.Router();
const { sendVerificationMail } = require("../email/mail");
const validator = require("validator");
const { ResumeToken } = require("mongodb");
const User = db.User;
const Timeline = db.Timeline;
const Leaderboard = db.Leaderboard;

const Verification = require("../models/verification.modal");

router.post("/users/register", async (req, res) => {
  console.log("game ends  " + req.body.deviceId);
  let user = await User.findOne({ deviceId: req.body.deviceId });
  if (user) {
    res.status(200).send({
      message: user,
      status: 200,
    });
  } else {
    let user = new User();
    console.log("game ends CHECK " + req.body.deviceId + req.body.name);
    user.deviceId = req.body.deviceId;
    user.name = req.body.name;
    await user.save();
    res.status(200).send({
      message: user,
      status: 200,
    });
  }
});

router.post("/users/timeLinePlayed", async (req, res) => {
  let user = await User.findById(req.body.id);
  let dateToday = await getTodaysDate();
  let timeLine = await Timeline.findOne({ date: dateToday });
  if (timeLine) {
    user.lastTimelineDate = dateToday;
    await user.save();
    res.status(200).send({
      message: timeLine,
      played: true,
      status: 200,
    });
  }
});

router.post("/users/setScore", async (req, res) => {
  let user = await User.findById(req.body.id);
  let dateToday = await getTodaysDate();
  let leaderBoard = await Leaderboard.findOne({ date: dateToday });
  if (leaderBoard) {
    if (!Array.isArray(leaderBoard.leaderBoard)) {
      leaderBoard.leaderBoard = [];
    }
    let data = { id: req.body.id, score: req.body.score, name: user.name };
    leaderBoard.leaderBoard.push(data);
    leaderBoard.leaderBoard.sort(compareScore);
    await leaderBoard.save();
  }
});
function compareScore(a, b) {
  return a.score - b.score;
}

router.post("/users/getTimeline", async (req, res) => {
  let user = await User.findById(req.body.id);
  let dateToday = await getTodaysDate();
  let yesterdaydate = await getYesterdayDate();
  let timeLine = await Timeline.findOne({ date: dateToday });
  let yesterdayTimeLine = await Timeline.findOne({ date: yesterdaydate });
  let lastLeaderboard = false;
  if (yesterdayTimeLine) {
    lastLeaderboard = true;
  }
  if (timeLine) {
    console.log(dateToday);
    console.log(user.lastTimelineDate);
    if (user.lastTimelineDate == dateToday) {
      res.status(200).send({
        message: timeLine,
        played: true,
        isLastLeaderboard: lastLeaderboard,
        status: 200,
      });
    } else {
      res.status(200).send({
        message: timeLine,
        played: false,
        isLastLeaderboard: lastLeaderboard,
        status: 200,
      });
    }
  } else {
    let timeLine = new Timeline();
    timeLine.date = dateToday;
    timeLine.timeline = await randomTimeline();
    timeLine.mode = await randomScience();
    let randomStage = Math.floor(Math.random() * 4) + 0;
    timeLine.stage2Start = board["stage"][randomStage]["stage2"];
    timeLine.stage3Start = board["stage"][randomStage]["stage3"];
    timeLine.stage4Start = board["stage"][randomStage]["stage4"];
    timeLine.stage5Start = board["stage"][randomStage]["stage5"];
    await timeLine.save();
    let leaderboard = new Leaderboard();
    leaderboard.date = timeLine.date;
    await leaderboard.save();
    res.status(200).send({
      message: timeLine,
      played: false,
      isLastLeaderboard: lastLeaderboard,
      status: 200,
    });
  }
});

router.post("/users/getLeaderBoard", async (req, res) => {
  let user = await User.findById(req.body.id);

  let dateToday = await getTodaysDate();
  if (req.body.today == false) {
    dateToday = await getYesterdayDate();
  }
  let leaderBoard = await Leaderboard.findOne({ date: dateToday });
  let page = req.body.page;
  if (leaderBoard) {
    let leader = [];
    if (!Array.isArray(leader)) {
      leader = [];
    }
    for (let i = 10 * page; i < 10 + 10 * page; i++) {
      if (leaderBoard.leaderBoard.length > i) {
        leader.push(leaderBoard.leaderBoard[i]);
      }
    }
    res.status(200).send({
      message: leader,

      status: 200,
    });
  }
});

async function randomTimeline() {
  let s = "";
  for (let i = 1; i < 20; i++) {
    if (i % 4 == 0) {
      s += "-";
    } else s += Math.floor(Math.random() * 4) + 0;
  }
  return s;
}
async function randomScience() {
  return Math.floor(Math.random() * 5) + 0;
}
async function getTodaysDate() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();
  today = mm + "/" + dd + "/" + yyyy;
  return today;
}

async function getYesterdayDate() {
  var today = new Date(); // Today!
  today.setDate(today.getDate() - 1);
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();
  today = mm + "/" + dd + "/" + yyyy;
  return today;
}
module.exports = router;
