/**
 * Artist Entity Module Exports
 * 
 * Centralizes all artist-related components for easy importing.
 * Provides artist model, controller, and routes.
 */

const ArtistController = require("./artist.controller");
const Artist = require("./artist.model");
const artistRouter = require("./artist.route");

module.exports = {
  Artist,
  ArtistController,
  artistRouter
};