/**
 * Track Routes
 * 
 * Defines HTTP routes for individual track operations.
 * Public routes accessible without authentication.
 * 
 * Routes:
 * - GET /album/:albumId - Get all tracks for specific album
 * - GET / - Get all tracks with album data
 * - GET /:id - Get specific track by ID
 */

const express = require("express");
const TrackController = require("./track.controller");

const trackRouter = express.Router();

// Get tracks by album - all tracks for a specific album
trackRouter.get("/album/:albumId", TrackController.getTracksByAlbumId);

// Get all tracks - complete track catalog with album info
trackRouter.get("/", TrackController.getAllTracks);

// Get track by ID - individual track details
trackRouter.get("/:id", TrackController.getTrackById);

module.exports = trackRouter;
