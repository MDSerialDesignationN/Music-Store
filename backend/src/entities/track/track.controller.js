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
          error: "Invalid album ID format",
        });
      }

      const tracks = await Track.findByAlbumId(parseInt(albumId));

      if (!tracks || tracks.length === 0) {
        return res
          .status(404)
          .json({ error: "No tracks found for this album." });
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
          error: "Invalid track ID format",
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

  /**
   * Create a new track
   *
   * @param {Object} req - Express request object
   * @param {Object} req.body - Request body containing track data
   * @param {string} req.body.title - Track title
   * @param {number} req.body.duration_seconds - Track duration in seconds
   * @param {number} req.body.album_id - Album ID this track belongs to
   * @param {Object} res - Express response object
   * @returns {Object} JSON response with created track
   */
  static async createTrack(req, res) {
    try {
      const { title, duration_seconds, album_id } = req.body;

      // Validate required fields
      if (!title || !duration_seconds || !album_id) {
        return res.status(400).json({
          error: "Title, duration_seconds, and album_id are required",
        });
      }

      // Validate duration is a positive number
      if (duration_seconds <= 0) {
        return res.status(400).json({
          error: "Duration must be a positive number",
        });
      }

      // Create the track
      const result = await Track.create({
        title,
        duration_seconds,
        album_id,
      });

      res.status(201).json({
        message: "Track created successfully",
        track: {
          trackId: result.insertId,
          title,
          duration_seconds,
          album_id,
        },
      });
    } catch (error) {
      console.error("Error creating track:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  /**
   * Update an existing track
   *
   * @param {Object} req - Express request object
   * @param {Object} req.params - Route parameters
   * @param {string} req.params.id - Track ID
   * @param {Object} req.body - Request body containing track data
   * @param {Object} res - Express response object
   * @returns {Object} JSON response with updated track
   */
  static async updateTrack(req, res) {
    try {
      const { id } = req.params;
      const { title, duration_seconds, album_id } = req.body;

      // Validate ID format
      if (!/^\d+$/.test(id)) {
        return res.status(400).json({
          error: "Invalid track ID format",
        });
      }

      // Check if track exists
      const existingTrack = await Track.findById(parseInt(id));
      if (!existingTrack) {
        return res.status(404).json({ error: "Track not found" });
      }

      // Validate duration if provided
      if (duration_seconds !== undefined && duration_seconds <= 0) {
        return res.status(400).json({
          error: "Duration must be a positive number",
        });
      }

      // Update the track
      const updateData = {};
      if (title) updateData.title = title;
      if (duration_seconds) updateData.duration_seconds = duration_seconds;
      if (album_id) updateData.album_id = album_id;

      const result = await Track.updateOne(parseInt(id), updateData);

      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ error: "Track not found or no changes made" });
      }

      res.json({
        message: "Track updated successfully",
        track: {
          trackId: parseInt(id),
          title: title || existingTrack.title,
          duration_seconds: duration_seconds || existingTrack.durationSeconds,
          album_id: album_id || existingTrack.albumId,
        },
      });
    } catch (error) {
      console.error("Error updating track:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  /**
   * Delete a track
   *
   * @param {Object} req - Express request object
   * @param {Object} req.params - Route parameters
   * @param {string} req.params.id - Track ID
   * @param {Object} res - Express response object
   * @returns {Object} JSON response confirming deletion
   */
  static async deleteTrack(req, res) {
    try {
      const { id } = req.params;

      // Validate ID format
      if (!/^\d+$/.test(id)) {
        return res.status(400).json({
          error: "Invalid track ID format",
        });
      }

      // Check if track exists
      const existingTrack = await Track.findById(parseInt(id));
      if (!existingTrack) {
        return res.status(404).json({ error: "Track not found" });
      }

      // Delete the track
      const result = await Track.deleteOne(parseInt(id));

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Track not found" });
      }

      res.json({ message: "Track deleted successfully" });
    } catch (error) {
      console.error("Error deleting track:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

module.exports = TrackController;
