/**
 * Auth Entity Module Exports
 * 
 * Centralizes all authentication-related components for easy importing.
 * Provides authentication controller and routes (no separate model).
 */

const AuthController = require("./auth.controller");
const authRouter = require("./auth.route");

module.exports = {
  AuthController,
  authRouter
};