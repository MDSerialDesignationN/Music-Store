/**
 * Album Entity Module Exports
 * 
 * Centralizes all album-related components for easy importing.
 * Provides album catalog model, controller, and routes.
 */

const Album = require('./album.model');
const AlbumController = require('./album.controller');
const albumRouter = require('./album.route');

module.exports = {
  Album,
  AlbumController,
  albumRouter
};