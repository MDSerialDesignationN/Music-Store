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
const GenreController = require("./genre.controller");

const genreRouter = express.Router();

// Get all genres
genreRouter.get("/", GenreController.getAllGenres);

module.exports = genreRouter;
