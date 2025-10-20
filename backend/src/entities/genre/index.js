/**
 * User Entity Module Exports
 *
 * Centralizes all user-related components for easy importing.
 * Provides a single point of access to user model, controller, and routes.
 */

const GenreController = require("./genre.controller");
const Genre = require("./genre.model");
const genreRouter = require("./genre.route");

module.exports = {
  GenreController,
  Genre,
  genreRouter,
};
