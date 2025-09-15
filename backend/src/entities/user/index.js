const UserController = require("./user.controller");
const User = require("./user.model");
const userRouter = require("./user.route");



module.exports = {
  User,
  UserController,
  userRouter
};