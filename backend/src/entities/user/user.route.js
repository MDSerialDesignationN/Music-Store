/**
 * User Routes
 * 
 * Defines HTTP routes for user management operations.
 * Currently handles user registration functionality.
 * 
 * Routes:
 * - POST / - Create new user account (registration)
 */

const express = require("express");
const UserController = require("./user.controller");

const userRouter = express.Router();

// User registration route - creates new user with automatic cart setup
userRouter.post("/", UserController.createUser);


module.exports = userRouter;
