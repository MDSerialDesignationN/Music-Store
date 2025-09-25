/**
 * Authentication Routes
 * 
 * Defines HTTP routes for user authentication operations.
 * Includes appropriate middleware for route protection.
 * 
 * Routes:
 * - POST /login - User login (guest only)
 * - GET /session - Get current session info
 * - POST /logout - User logout (authenticated only)
 */

const express = require("express");
const AuthController = require("./auth.controller");
const { requireAuth, requireGuest } = require("../../../middleware/auth");

const authRouter = express.Router();

// Login route - only accessible to non-authenticated users
authRouter.post("/login", requireGuest, AuthController.login);

// Session check route - accessible to all users
authRouter.get("/session", AuthController.getSession);

// Logout route - only accessible to authenticated users
authRouter.post("/logout", requireAuth, AuthController.logout);


module.exports = authRouter;
