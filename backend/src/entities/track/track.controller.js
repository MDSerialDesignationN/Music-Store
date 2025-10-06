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
            // Validate ID format (should be numeric for MySQL)
            if (!/^\d+$/.test(albumId)) {
                return res.status(400).json({
                    error: "Invalid album ID format"
                });
            }

            const tracks = await Track.findByAlbumId(parseInt(albumId));

            if (!tracks || tracks.length === 0) {
                return res.status(404).json({ error: "No tracks found for this album." });
            }

            // Transform the tracks to have cleaner, more readable field names
            const transformedTracks = tracks.map((track) => ({
                id: track.trackId,
                title: track.title,
                duration_seconds: track.durationSeconds,
                album_id: track.albumId,
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
            const tracks = await Track.find();

            if (!tracks || tracks.length === 0) {
                return res.status(404).json({ error: "No tracks available." });
            }

            // Transform the tracks to have cleaner field names
            const transformedTracks = tracks.map((track) => ({
                id: track.trackId,
                title: track.title,
                duration_seconds: track.durationSeconds,
                album_id: track.albumId,
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
            // Validate ID format (should be numeric for MySQL)
            if (!/^\d+$/.test(id)) {
                return res.status(400).json({
                    error: "Invalid track ID format"
                });
            }

            const track = await Track.findById(parseInt(id));

            if (!track) {
                return res.status(404).json({ error: "Track not found" });
            }

            res.json({
                message: "Track retrieved successfully",
                track: {
                    id: track.trackId,
                    title: track.title,
                    duration_seconds: track.durationSeconds,
                    album_id: track.albumId,
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
