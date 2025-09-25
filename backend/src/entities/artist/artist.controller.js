const { Album } = require("../album");
const { Track } = require("../track");
const Artist = require("./artist.model");

/**
 * ArtistController Class
 * 
 * Handles HTTP requests related to artist operations.
 * Manages artist retrieval, detailed artist information with albums,
 * and artist-related data aggregation.
 * 
 * Features:
 * - All artists retrieval
 * - Individual artist details with albums
 * - Album filtering (only albums with tracks)
 * - Populated genre information
 * - Track counting for album validation
 */
class ArtistController {

    /**
     * Get All Artists
     * 
     * Retrieves all artists from the database.
     * Returns basic artist information (name, country).
     * 
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Object} JSON response with all artists
     */
    static async getAllArtists(req, res) {
        try {
            const artists = await Artist.find({});

            if (!artists || artists.length === 0) {
                return res.status(404).json({ error: "No artists available." });
            }

            res.json({
                message: "Artists retrieved successfully",
                artists: artists,
            });
        } catch (error) {
            console.error("Error retrieving artists:", error);
            res.status(500).json({
                error: "Internal Server Error while retrieving artists",
                details: error.message,
            });
        }
    }

    /**
     * Get Artist by ID with Albums
     * 
     * Retrieves a specific artist with their albums and associated data.
     * Only includes albums that have tracks to ensure complete data.
     * 
     * @param {Object} req - Express request object
     * @param {Object} req.params - Route parameters
     * @param {string} req.params.id - Artist ID
     * @param {Object} res - Express response object
     * @returns {Object} JSON response with artist details and albums
     */
    static async getArtistById(req, res) {
        const { id } = req.params;

        try {
            const artist = await Artist.findById(id);
            if (!artist) {
                return res.status(404).json({ error: "Artist not found" });
            }

            // Get all albums by this artist with populated genre information
            const albums = await Album.find({ artist_id: id }).populate(
                "genre_id",
                "name"
            );

            // Filter albums that have tracks (ensures complete album data)
            const albumsWithTracks = [];
            for (const album of albums) {
                const trackCount = await Track.countDocuments({ album_id: album._id });
                if (trackCount > 0) {
                    albumsWithTracks.push({
                        _id: album._id,
                        title: album.title,
                        release_year: album.release_year,
                        genre: album.genre_id,
                        trackCount: trackCount,
                    });
                }
            }

            res.json({
                message: "Artist retrieved successfully",
                artist: {
                    _id: artist._id,
                    name: artist.name,
                    country: artist.country,
                    albumCount: albumsWithTracks.length,
                    albums: albumsWithTracks,
                },
            });
        } catch (error) {
            console.error("Error retrieving artist:", error);
            res.status(500).json({
                error: "Internal Server Error while retrieving artist",
                details: error.message,
            });
        }
    }
}

module.exports = ArtistController;
