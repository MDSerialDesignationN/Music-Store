/**
 * Album Routes
 *
 * Defines HTTP routes for album catalog operations.
 * Public routes accessible without authentication.
 *
 * Routes:
 * - GET / - Get all albums with artist/genre data
 * - GET /:id - Get specific album by ID with tracks
 */

const express = require("express");
const AlbumController = require("./album.controller");

const albumRouter = express.Router();

// Get all albums - retrieves catalog with populated artist/genre data
albumRouter.get("/", AlbumController.getAllAlbumsFiltered);

// Get all albums - retrieves catalog with populated artist/genre data (even empty ones)
albumRouter.get("/all", AlbumController.getAllAlbums);

// Get album by ID - detailed album info with tracks
albumRouter.get("/:id", AlbumController.getAlbumById);

albumRouter.delete("/:id", AlbumController.deleteAlbum);

module.exports = albumRouter;
