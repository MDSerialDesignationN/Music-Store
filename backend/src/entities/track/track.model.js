const { default: mongoose } = require("mongoose");

/**
 * Track Model Schema
 * 
 * Defines individual track data structure within albums.
 * Tracks belong to albums and contain timing information.
 * 
 * Features:
 * - Track title (required)
 * - Duration in seconds for precise timing
 * - Album reference for data relationships
 * - Support for album population queries
 * - Used for album completeness validation
 */
const trackSchema = new mongoose.Schema({
  title: { type: String, required: true },
  duration_seconds: { type: Number, required: true },
  album_id: { type: mongoose.Types.ObjectId, ref: "Album", required: true },
});

const Track = mongoose.model("Track", trackSchema);
module.exports = Track;
