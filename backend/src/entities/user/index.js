/**
 * User Entity Module Exports
 * 
 * Centralizes all user-related components for easy importing.
 * Provides a single point of access to user model, controller, and routes.
 */

const UserController = require("./user.controller");
const User = require("./user.model");
const userRouter = require("./user.route");

module.exports = {
  User,
  UserController,
  userRouter
};