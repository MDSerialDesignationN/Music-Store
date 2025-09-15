const express = require("express");
const TrackController = require("./track.controller");

const trackRouter = express.Router();

trackRouter.get("/album/:albumId", TrackController.getTracksByAlbumId);
trackRouter.get("/", TrackController.getAllTracks);
trackRouter.get("/:id", TrackController.getTrackById);

module.exports = trackRouter;
