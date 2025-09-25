/**
 * Track Entity Module Exports
 * 
 * Centralizes all track-related components for easy importing.
 * Provides individual track model, controller, and routes.
 */

const TrackController = require("./track.controller");
const Track = require("./track.model");
const trackRouter = require("./track.route");

module.exports = {
  Track,
  TrackController,
  trackRouter
};