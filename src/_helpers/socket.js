const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const db = require("./db");

const User = db.User;

//const schedule = require('node-schedule');

async function getKeyByValue(object, value) {
  return Object.keys(object).find((key) => object[key] === value);
}

module.exports = function (io) {
  console.log("daafvuv" + io);
  let all_users = {};
  io.on("connection", async function (socket) {
    console.log(
      "Connected On Network" + socket.id + "   " + socket.handshake.query.token
    );
    let secret = "amitscreatingthisprojectToManuplulate";
    let isRevoked = socket.handshake.query.token;
    try {
      const decoded = jwt.verify(isRevoked.trim(), secret);
      all_users[socket.id] = decoded.sub;
      let fromuser = await User.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(decoded.sub) },
        { is_online: 1, socket_id: socket.id },
        { new: true }
      );

      console.log({ fromuser });
    } catch (err) {
      console.log("errrr " + err);

      socket.emit("UnAuthorized", {
        response: "User not authorized",
      });
    }

    socket.on("disconnect", function () {
      console.log(" has disconnected from the chat." + socket.id);
      console.log({ all_users });
      //  userService.setOfflineUsers(socket, all_users);
      delete all_users[socket.id];
      console.log(all_users);
    });
  });
};
