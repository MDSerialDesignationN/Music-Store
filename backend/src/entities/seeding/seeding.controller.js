const { Artist } = require("../artist");
const Genre = require("../../../database/models/Genre");
const { Album } = require("../album");
const { Track } = require("../track");
const { faker } = require('@faker-js/faker');

/**
 * SeedingController Class
 * 
 * Handles database seeding operations for development and testing.
 * Provides endpoints to populate the database with sample data
 * for all entities (artists, albums, tracks, genres).
 * 
 * Features:
 * - Artist seeding with faker data
 * - Album seeding with artist relationships
 * - Track seeding with album relationships
 * - Genre seeding for categorization
 * - Duplicate prevention and error handling
 * - Batch operations for efficient seeding
 * 
 * Note: This is primarily for development/testing environments
 */
class SeedingController {
    /**
     * Seed Artists
     * 
     * Creates multiple artist records using faker-generated data.
     * Prevents duplicate artists and provides detailed operation results.
     * 
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Object} JSON response with seeding results and statistics
     */
    static async seedArtists(req, res) {
        try {
            const number = 100; // Reduced max for safety
            const createdData = [];
            const errors = [];
            const skipped = [];

            for (let i = 0; i < number; i++) {
                try {
                    const name = faker.music.artist();
                    const country = faker.location.country();

                    // Check if artist with this name already exists (prevent duplicates)
                    const existingArtists = await Artist.find({ name: name });
                    if (existingArtists && existingArtists.length > 0) {
                        skipped.push(`Artist "${name}" already exists`);
                        continue;
                    }

                    const artistResult = await Artist.create({
                        name,
                        country,
                    });

                    createdData.push({
                        artistId: artistResult.insertId,
                        name,
                        country
                    });
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
    }

    static async seedGenres(req, res) {
        try {
            const number = 10; // Reduced max for safety
            const createdData = [];
            const errors = [];
            const skipped = [];

            for (let i = 0; i < number; i++) {
                try {
                    const name = faker.music.genre();

                    // Check if genre with this name already exists
                    const existingGenres = await Genre.find({ name: name });
                    if (existingGenres && existingGenres.length > 0) {
                        skipped.push(`Genre "${name}" already exists`);
                        continue;
                    }

                    const genreResult = await Genre.create({
                        name,
                    });

                    createdData.push({
                        genreId: genreResult.insertId,
                        name
                    });
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
    }

    static async seedAlbums(req, res) {
        try {
            const number = 200; // Reduced max for safety
            const createdData = [];
            const errors = [];
            const skipped = [];

            for (let i = 0; i < number; i++) {
                try {
                    const title = faker.music.songName();
                    const release_year = faker.date.between({ from: '1950-01-01', to: '2023-12-31' }).getFullYear();
                    
                    // Get random artist and genre
                    const artists = await Artist.find();
                    const genres = await Genre.find();
                    
                    if (artists.length === 0 || genres.length === 0) {
                        errors.push('No artists or genres available for album creation');
                        continue;
                    }
                    
                    const artist_id = artists[Math.floor(Math.random() * artists.length)].artistId;
                    const genre_id = genres[Math.floor(Math.random() * genres.length)].genreId;

                    // Check if album with this title and artist already exists
                    const existingAlbums = await Album.find({
                        title: title,
                        artistId: artist_id,
                    });
                    if (existingAlbums && existingAlbums.length > 0) {
                        skipped.push(`Album "${title}" by this artist already exists`);
                        continue;
                    }

                    const albumResult = await Album.create({
                        title,
                        release_year,
                        artist_id,
                        genre_id,
                        price: parseFloat(faker.commerce.price({ min: 5.99, max: 19.99 })),
                    });

                    createdData.push({
                        albumId: albumResult.insertId,
                        title,
                        release_year,
                        artistId: artist_id,
                        genreId: genre_id
                    });
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
    }

    static async seedTracks(req, res) {
        try {
            const number = 1000; // Reduced max for safety
            const createdData = [];
            const errors = [];
            const skipped = [];

            for (let i = 0; i < number; i++) {
                try {
                    const title = faker.music.songName();
                    const duration_seconds = faker.number.int({ min: 60, max: 600 });
                    // Get random album
                    const albums = await Album.find();
                    
                    if (albums.length === 0) {
                        errors.push('No albums available for track creation');
                        continue;
                    }
                    
                    const album_id = albums[Math.floor(Math.random() * albums.length)].albumId;

                    // Check if track with this title already exists in this album
                    const existingTracks = await Track.find({
                        title: title,
                        albumId: album_id,
                    });
                    if (existingTracks && existingTracks.length > 0) {
                        skipped.push(`Track "${title}" already exists in this album`);
                        continue;
                    }

                    const trackResult = await Track.create({
                        title,
                        duration_seconds,
                        album_id,
                    });

                    createdData.push({
                        trackId: trackResult.insertId,
                        title,
                        duration_seconds,
                        albumId: album_id
                    });
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
    }
}

module.exports = SeedingController;
