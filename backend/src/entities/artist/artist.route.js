const express = require("express");
const ArtistController = require("./artist.controller");

const artistRouter = express.Router();

artistRouter.get("/", ArtistController.getAllArtists);
artistRouter.get("/:id", ArtistController.getArtistById);

module.exports = artistRouter;
