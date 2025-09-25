/**
 * Seeding Routes
 * 
 * Defines HTTP routes for database seeding operations.
 * Development/testing routes for populating database with sample data.
 * 
 * Routes:
 * - POST /artist - Seed artists with faker data
 * - POST /genre - Seed music genres
 * - POST /album - Seed albums with artist/genre relationships
 * - POST /track - Seed tracks with album relationships
 * 
 * Note: These routes should be restricted in production environments
 */

const express = require("express");
const SeedingController = require("./seeding.controller");

const seedingRouter = express.Router();

// Seed artists - creates multiple artists with faker data
seedingRouter.post("/artist", SeedingController.seedArtists);

// Seed genres - creates music genre categories
seedingRouter.post("/genre", SeedingController.seedGenres);

// Seed albums - creates albums with artist/genre relationships
seedingRouter.post("/album", SeedingController.seedAlbums);

// Seed tracks - creates tracks with album relationships
seedingRouter.post("/track", SeedingController.seedTracks);

module.exports = seedingRouter;
