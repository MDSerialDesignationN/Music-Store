/**
 * Artist Routes
 *
 * Defines HTTP routes for artist information operations.
 * Public routes accessible without authentication.
 *
 * Routes:
 * - GET / - Get all artists with basic info
 * - GET /:id - Get specific artist with albums and tracks
 */

const express = require("express");
const ArtistController = require("./artist.controller");

const artistRouter = express.Router();

// Get all artists - basic artist information (name, country)
artistRouter.get("/", ArtistController.getAllArtists);

// Get artist by ID - detailed artist info with albums
artistRouter.get("/:id", ArtistController.getArtistById);

// Create a new artist
artistRouter.post("/", ArtistController.createArtist);

// Update an existing artist
artistRouter.put("/:id", ArtistController.updateArtist);

// Delete an artist
artistRouter.delete("/:id", ArtistController.deleteArtist);

module.exports = artistRouter;
