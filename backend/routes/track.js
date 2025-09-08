const express = require("express");
const DatabaseManager = require("../database/DatabaseManager");
const Track = require("../database/models/track");
const Album = require("../database/models/album");

const trackRouter = express.Router();

// Get all tracks for a specific album
trackRouter.get("/album/:albumId", async (req, res) => {
  const { albumId } = req.params;

  try {
    const tracks = await Track.find({ album_id: albumId }).populate(
      "album_id",
      "title release_year"
    );

    if (!tracks || tracks.length === 0) {
      return res.status(404).json({ error: "No tracks found for this album." });
    }

    // Transform the tracks to have cleaner field names
    const transformedTracks = tracks.map((track) => ({
      _id: track._id,
      title: track.title,
      duration_seconds: track.duration_seconds,
      album: track.album_id,
    }));

    res.json({
      message: "Tracks retrieved successfully",
      tracks: transformedTracks,
    });
  } catch (error) {
    console.error("Error retrieving tracks:", error);
    res.status(500).json({
      error: "Internal Server Error while retrieving tracks",
      details: error.message,
    });
  }
});

// Get all tracks
trackRouter.get("/", async (req, res) => {
  try {
    const tracks = await Track.find({}).populate(
      "album_id",
      "title release_year"
    );

    if (!tracks || tracks.length === 0) {
      return res.status(404).json({ error: "No tracks available." });
    }

    // Transform the tracks to have cleaner field names
    const transformedTracks = tracks.map((track) => ({
      _id: track._id,
      title: track.title,
      duration_seconds: track.duration_seconds,
      album: track.album_id,
    }));

    res.json({
      message: "Tracks retrieved successfully",
      tracks: transformedTracks,
    });
  } catch (error) {
    console.error("Error retrieving tracks:", error);
    res.status(500).json({
      error: "Internal Server Error while retrieving tracks",
      details: error.message,
    });
  }
});

// Get a specific track by ID
trackRouter.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const track = await Track.findById(id).populate(
      "album_id",
      "title release_year"
    );

    if (!track) {
      return res.status(404).json({ error: "Track not found" });
    }

    res.json({
      message: "Track retrieved successfully",
      track: {
        _id: track._id,
        title: track.title,
        duration_seconds: track.duration_seconds,
        album: track.album_id,
      },
    });
  } catch (error) {
    console.error("Error retrieving track:", error);
    res.status(500).json({
      error: "Internal Server Error while retrieving track",
      details: error.message,
    });
  }
});

module.exports = trackRouter;
