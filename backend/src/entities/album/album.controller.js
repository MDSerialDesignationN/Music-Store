const { Track } = require('../track');
const Album = require('./album.model');

/**
 * AlbumController Class
 * 
 * Handles HTTP requests related to album operations.
 * Manages album catalog retrieval, individual album details,
 * and album filtering based on track availability.
 * 
 * Features:
 * - All albums retrieval with artist and genre population
 * - Album filtering (only albums with tracks)
 * - Individual album details with track information
 * - Data transformation for clean API responses
 * - Genre-based album filtering
 */
class AlbumController {

    /**
     * Get All Albums
     * 
     * Retrieves all albums from the catalog with populated artist and genre data.
     * Filters albums to only include those that have tracks (complete albums).
     * 
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Object} JSON response with all available albums
     */
    static async getAllAlbums(req, res) {
        try {
            const albums = await Album.find({})
                .populate("artist_id", "name country")
                .populate("genre_id", "name");

            if (!albums || albums.length === 0) {
                return res.status(404).json({
                    error: "There are no albums available."
                });
            }

            // Filter albums that have tracks (ensures complete album data)
            const albumsWithTracks = [];
            for (const album of albums) {
                const trackCount = await Track.countDocuments({ album_id: album._id });
                if (trackCount > 0) {
                    albumsWithTracks.push(album);
                }
            }

            if (albumsWithTracks.length === 0) {
                return res.status(404).json({
                    error: "No albums with tracks available."
                });
            }

            // Transform the albums to have cleaner, more readable field names
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
    }

    static async getAlbumById(req, res) {
        try {
            const { id } = req.params;

            // Validate ObjectId format
            if (!id.match(/^[0-9a-fA-F]{24}$/)) {
                return res.status(400).json({
                    error: "Invalid album ID format"
                });
            }

            const album = await Album.findById(id)
                .populate("artist_id", "name country")
                .populate("genre_id", "name");

            if (!album) {
                return res.status(404).json({
                    error: "Album not found"
                });
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
    }
}

module.exports = AlbumController;
