const express = require("express");
const SeedingController = require("./seeding.controller");

const seedingRouter = express.Router();

seedingRouter.post("/artist", SeedingController.seedArtists);
seedingRouter.post("/genre", SeedingController.seedGenres);
seedingRouter.post("/album", SeedingController.seedAlbums);
seedingRouter.post("/track", SeedingController.seedTracks);

module.exports = seedingRouter;
