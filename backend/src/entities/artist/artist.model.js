const { default: mongoose } = require("mongoose");

/**
 * Artist Model Schema
 * 
 * Defines the artist data structure for the Music Store catalog.
 * Artists are referenced by albums and provide additional metadata.
 * 
 * Features:
 * - Artist name (required)
 * - Country of origin (required)
 * - Simple structure for easy referencing from albums
 * - Support for population in album queries
 */
const artistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  country: { type: String, required: true },
});

const Artist = mongoose.model("Artist", artistSchema);
module.exports = Artist;
