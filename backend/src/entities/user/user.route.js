/**
 * User Routes
 *
 * Defines HTTP routes for user management operations.
 * Handles user registration, admin user statistics, and user management.
 *
 * Routes:
 * - GET / - Get all users (without passwords) for admin statistics
 * - POST / - Create new user account (registration)
 * - PUT /:userId - Update user details (username, email, password, admin status)
 * - PUT /:userId/admin - Update user admin status (promote/demote)
 */

const express = require("express");
const UserController = require("./user.controller");

const userRouter = express.Router();

// Get all users (without passwords) for admin statistics
userRouter.get("/", UserController.getAllUsers);

// User registration route - creates new user with automatic cart setup
userRouter.post("/", UserController.createUser);

// Update user details (username, email, password, admin status)
userRouter.put("/:userId", UserController.updateUser);

// Update user admin status (promote/demote users)
userRouter.put("/:userId/admin", UserController.updateAdminStatus);

module.exports = userRouter;
