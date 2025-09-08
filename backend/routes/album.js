const express = require("express");
const DatabaseManager = require("../database/DatabaseManager");
const Album = require("../database/models/album");
const Track = require("../database/models/track");
const { requireAuth } = require("../middleware/auth");

const albumRouter = express.Router();

albumRouter.get("/", async (req, res) => {
  try {
    const albums = await Album.find({})
      .populate("artist_id", "name country")
      .populate("genre_id", "name");

    if (!albums || albums.length === 0) {
      return res.status(404).json({ error: "There are no albums available." });
    }

    // Filter albums that have tracks
    const albumsWithTracks = [];
    for (const album of albums) {
      const trackCount = await Track.countDocuments({ album_id: album._id });
      if (trackCount > 0) {
        albumsWithTracks.push(album);
      }
    }

    if (albumsWithTracks.length === 0) {
      return res
        .status(404)
        .json({ error: "No albums with tracks available." });
    }

    // Transform the albums to have cleaner field names
    const transformedAlbums = albumsWithTracks.map((album) => ({
      _id: album._id,
      title: album.title,
      release_year: album.release_year,
      artist: album.artist_id,
      genre: album.genre_id,
      price: album.price,
    }));

    res.json({
      message: "Albums retrieved successfully",
      albums: transformedAlbums,
    });
  } catch (error) {
    console.error("Error retrieving albums:", error);
    res.status(500).json({
      error: "Internal Server Error while retrieving albums",
      details: error.message,
    });
  }
});

albumRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const album = await Album.findById(id)
      .populate("artist_id", "name country")
      .populate("genre_id", "name");
    if (!album) {
      return res.status(404).json({ error: "Album not found" });
    }
    res.json({
      message: "Album retrieved successfully",
      album: {
        _id: album._id,
        title: album.title,
        release_year: album.release_year,
        artist: album.artist_id,
        genre: album.genre_id,
      },
    });
  } catch (error) {
    console.error("Error retrieving album:", error);
    res.status(500).json({
      error: "Internal Server Error while retrieving album",
      details: error.message,
    });
  }
});

module.exports = albumRouter;
