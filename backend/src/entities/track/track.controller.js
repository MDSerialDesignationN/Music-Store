const Track = require("./track.model");

/**
 * TrackController Class
 * 
 * Handles HTTP requests related to track operations.
 * Manages track retrieval by album, all tracks listing,
 * and track data with populated album information.
 * 
 * Features:
 * - Tracks by album ID with album details
 * - All tracks retrieval with album population
 * - Data transformation for clean API responses
 * - Duration formatting and album metadata
 */
class TrackController {
    /**
     * Get Tracks by Album ID
     * 
     * Retrieves all tracks for a specific album with populated album information.
     * Transforms data to provide clean field names for frontend consumption.
     * 
     * @param {Object} req - Express request object
     * @param {Object} req.params - Route parameters
     * @param {string} req.params.albumId - Album ID to get tracks for
     * @param {Object} res - Express response object
     * @returns {Object} JSON response with album tracks
     */
    static async getTracksByAlbumId(req, res) {
        const { albumId } = req.params;

        try {
            const tracks = await Track.find({ album_id: albumId }).populate(
                "album_id",
                "title release_year"
            );

            if (!tracks || tracks.length === 0) {
                return res.status(404).json({ error: "No tracks found for this album." });
            }

            // Transform the tracks to have cleaner, more readable field names
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
    }

    static async getAllTracks(req, res) {
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
    }

    static async getTrackById(req, res) {
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
    }
}

module.exports = TrackController;
