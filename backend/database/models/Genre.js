const { default: mongoose } = require("mongoose");

/**
 * Genre Model Schema
 * 
 * Defines music genre data structure for album categorization.
 * Simple model for music genre classification.
 * 
 * Features:
 * - Genre name (required)
 * - Referenced by albums for categorization
 * - Used in album filtering and search
 * - Simple structure for easy management
 */
const genreSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

const Genre = mongoose.model("Genre", genreSchema);
module.exports = Genre;
