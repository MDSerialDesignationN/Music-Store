const express = require("express");
const DatabaseManager = require("../database/DatabaseManager");
const Artist = require("../database/models/artist");
const { faker } = require("@faker-js/faker");
const Genre = require("../database/models/genre");
const Album = require("../database/models/album");
const Track = require("../database/models/track");

const seedingRouter = express.Router();

seedingRouter.post("/artist", async (req, res) => {
  try {
    const number = 30; // Reduced max for safety
    const createdData = [];
    const errors = [];
    const skipped = [];

    for (let i = 0; i < number; i++) {
      try {
        const name = faker.music.artist();
        const country = faker.location.country();

        // Check if artist with this name already exists
        const existingArtist = await Artist.findOne({ name: name });
        if (existingArtist) {
          skipped.push(`Artist "${name}" already exists`);
          continue;
        }

        const artist = await DatabaseManager.createEntry(Artist, {
          name,
          country,
        });

        const artistObj = artist.toObject();
        createdData.push(artistObj);
      } catch (error) {
        console.error(`Error creating artist ${i + 1}:`, error);
        if (error.code === 11000) {
          errors.push(`Artist ${i + 1}: id already exists`);
        } else {
          errors.push(`Artist ${i + 1}: ${error.message}`);
        }
      }
    }

    // Send single response with all results
    res.status(201).json({
      message: "Seed operation completed",
      totalAttempted: number,
      successfullyCreated: createdData.length,
      skipped: skipped.length,
      errors: errors.length,
      errorDetails: errors.length > 0 ? errors.slice(0, 10) : [], // Show max 10 errors
      skippedDetails: skipped.length > 0 ? skipped.slice(0, 10) : [], // Show max 10 skipped
      artists: createdData,
    });
  } catch (error) {
    console.error("Error in seed operation:", error);
    res.status(500).json({
      error: "Internal Server Error during seed operation",
      details: error.message,
    });
  }
});

seedingRouter.post("/genre", async (req, res) => {
  try {
    const number = 5; // Reduced max for safety
    const createdData = [];
    const errors = [];
    const skipped = [];

    for (let i = 0; i < number; i++) {
      try {
        const name = faker.music.genre();

        // Check if genre with this name already exists
        const existingGenre = await Genre.findOne({ name: name });
        if (existingGenre) {
          skipped.push(`Genre "${name}" already exists`);
          continue;
        }

        const artist = await DatabaseManager.createEntry(Genre, {
          name,
        });

        const genreObj = artist.toObject();
        createdData.push(genreObj);
      } catch (error) {
        console.error(`Error creating genre ${i + 1}:`, error);
        if (error.code === 11000) {
          errors.push(`Genre ${i + 1}: id already exists`);
        } else {
          errors.push(`Genre ${i + 1}: ${error.message}`);
        }
      }
    }

    // Send single response with all results
    res.status(201).json({
      message: "Seed operation completed",
      totalAttempted: number,
      successfullyCreated: createdData.length,
      skipped: skipped.length,
      errors: errors.length,
      errorDetails: errors.length > 0 ? errors.slice(0, 10) : [], // Show max 10 errors
      skippedDetails: skipped.length > 0 ? skipped.slice(0, 10) : [], // Show max 10 skipped
      genres: createdData,
    });
  } catch (error) {
    console.error("Error in seed operation:", error);
    res.status(500).json({
      error: "Internal Server Error during seed operation",
      details: error.message,
    });
  }
});

seedingRouter.post("/album", async (req, res) => {
  try {
    const number = 50; // Reduced max for safety
    const createdData = [];
    const errors = [];
    const skipped = [];

    for (let i = 0; i < number; i++) {
      try {
        const title = faker.music.album();
        const release_year = faker.number.int({ min: 1950, max: 2023 });
        const artist_id = await Artist.aggregate([
          { $sample: { size: 1 } },
          { $project: { _id: 1 } },
        ]).then((res) => res[0]?._id);
        const genre_id = await Genre.aggregate([
          { $sample: { size: 1 } },
          { $project: { _id: 1 } },
        ]).then((res) => res[0]?._id);

        // Check if album with this title and artist already exists
        const existingAlbum = await Album.findOne({
          title: title,
          artist_id: artist_id,
        });
        if (existingAlbum) {
          skipped.push(`Album "${title}" by this artist already exists`);
          continue;
        }

        const album = await DatabaseManager.createEntry(Album, {
          title,
          release_year,
          artist_id,
          genre_id,
          price: faker.number.float({
            min: 5.99,
            max: 19.99,
            fractionDigits: 2,
          }),
        });

        const albumObj = album.toObject();
        createdData.push(albumObj);
      } catch (error) {
        console.error(`Error creating album ${i + 1}:`, error);
        if (error.code === 11000) {
          errors.push(`Album ${i + 1}: id already exists`);
        } else {
          errors.push(`Album ${i + 1}: ${error.message}`);
        }
      }
    }

    // Send single response with all results
    res.status(201).json({
      message: "Seed operation completed",
      totalAttempted: number,
      successfullyCreated: createdData.length,
      skipped: skipped.length,
      errors: errors.length,
      errorDetails: errors.length > 0 ? errors.slice(0, 10) : [], // Show max 10 errors
      skippedDetails: skipped.length > 0 ? skipped.slice(0, 10) : [], // Show max 10 skipped
      albums: createdData,
    });
  } catch (error) {
    console.error("Error in seed operation:", error);
    res.status(500).json({
      error: "Internal Server Error during seed operation",
      details: error.message,
    });
  }
});

seedingRouter.post("/track", async (req, res) => {
  try {
    const number = 100; // Reduced max for safety
    const createdData = [];
    const errors = [];
    const skipped = [];

    for (let i = 0; i < number; i++) {
      try {
        const title = faker.music.songName();
        const duration_seconds = faker.number.int({ min: 60, max: 600 });
        const album_id = await Album.aggregate([
          { $sample: { size: 1 } },
          { $project: { _id: 1 } },
        ]).then((res) => res[0]?._id);

        // Check if track with this title already exists in this album
        const existingTrack = await Track.findOne({
          title: title,
          album_id: album_id,
        });
        if (existingTrack) {
          skipped.push(`Track "${title}" already exists in this album`);
          continue;
        }

        const track = await DatabaseManager.createEntry(Track, {
          title,
          duration_seconds,
          album_id,
        });

        const trackObj = track.toObject();
        createdData.push(trackObj);
      } catch (error) {
        console.error(`Error creating track ${i + 1}:`, error);
        if (error.code === 11000) {
          errors.push(`Track ${i + 1}: id already exists`);
        } else {
          errors.push(`Track ${i + 1}: ${error.message}`);
        }
      }
    }

    // Send single response with all results
    res.status(201).json({
      message: "Seed operation completed",
      totalAttempted: number,
      successfullyCreated: createdData.length,
      skipped: skipped.length,
      errors: errors.length,
      errorDetails: errors.length > 0 ? errors.slice(0, 10) : [], // Show max 10 errors
      skippedDetails: skipped.length > 0 ? skipped.slice(0, 10) : [], // Show max 10 skipped
      tracks: createdData,
    });
  } catch (error) {
    console.error("Error in seed operation:", error);
    res.status(500).json({
      error: "Internal Server Error during seed operation",
      details: error.message,
    });
  }
});

module.exports = seedingRouter;
