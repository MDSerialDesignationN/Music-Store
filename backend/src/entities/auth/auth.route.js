/**
 * Authentication Routes
 *
 * Defines HTTP routes for user authentication operations.
 * Includes appropriate middleware for route protection.
 *
 * Routes:
 * - POST /login - User login (guest only)
 * - POST /admin-login - Admin login (guest only, requires admin privileges)
 * - GET /session - Get current session info
 * - GET /admin-session - Get current admin session info
 * - POST /logout - User logout (authenticated only)
 */

const express = require("express");
const AuthController = require("./auth.controller");
const { requireAuth, requireGuest } = require("../../../middleware/auth");

const authRouter = express.Router();

// Login route - only accessible to non-authenticated users
authRouter.post("/login", requireGuest, AuthController.login);

// Admin login route - only accessible to non-authenticated users
authRouter.post("/admin-login", requireGuest, AuthController.adminLogin);

// Session check route - accessible to all users
authRouter.get("/session", AuthController.getSession);

// Admin session check route - accessible to all users
authRouter.get("/admin-session", AuthController.getAdminSession);

// Logout route - only accessible to authenticated users
authRouter.post("/logout", requireAuth, AuthController.logout);

module.exports = authRouter;
