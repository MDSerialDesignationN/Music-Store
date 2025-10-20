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
      const artists = await Artist.find();

      await Promise.all(
        artists.map(async (artist) => {
          const albums = await Album.find({ artistId: artist.artistId });
          artist.albums = albums;
        })
      );

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
      // Validate ID format (should be numeric for MySQL)
      if (!/^\d+$/.test(id)) {
        return res.status(400).json({
          error: "Invalid artist ID format",
        });
      }

      const artist = await Artist.findById(parseInt(id));
      if (!artist) {
        return res.status(404).json({ error: "Artist not found" });
      }

      // Get all albums by this artist with genre information
      const albums = await Album.findWithDetails({ artistId: parseInt(id) });

      // Filter albums that have tracks (ensures complete album data)
      const albumsWithTracks = [];
      for (const album of albums) {
        const tracks = await Track.findByAlbumId(album.albumId);
        if (tracks.length > 0) {
          albumsWithTracks.push({
            id: album.albumId,
            title: album.title,
            release_year: album.releaseYear,
            genre: {
              name: album.genreName,
            },
            trackCount: tracks.length,
          });
        }
      }

      res.json({
        message: "Artist retrieved successfully",
        artist: {
          id: artist.artistId,
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

  /**
   * Create a new artist
   *
   * @param {Object} req - Express request object
   * @param {Object} req.body - Request body containing artist data
   * @param {string} req.body.name - Artist name
   * @param {string} req.body.country - Artist country
   * @param {Object} res - Express response object
   * @returns {Object} JSON response with created artist
   */
  static async createArtist(req, res) {
    try {
      const { name, country } = req.body;

      // Validate required fields
      if (!name || !country) {
        return res.status(400).json({ error: "Name and country are required" });
      }

      // Check if artist already exists
      const existingArtists = await Artist.find({ name });
      if (existingArtists.length > 0) {
        return res
          .status(400)
          .json({ error: "Artist with this name already exists" });
      }

      // Create the artist
      const result = await Artist.create({ name, country });

      res.status(201).json({
        message: "Artist created successfully",
        artist: {
          artistId: result.insertId,
          name,
          country,
        },
      });
    } catch (error) {
      console.error("Error creating artist:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  /**
   * Update an existing artist
   *
   * @param {Object} req - Express request object
   * @param {Object} req.params - Route parameters
   * @param {string} req.params.id - Artist ID
   * @param {Object} req.body - Request body containing artist data
   * @param {Object} res - Express response object
   * @returns {Object} JSON response with updated artist
   */
  static async updateArtist(req, res) {
    try {
      const { id } = req.params;
      const { name, country } = req.body;

      // Check if artist exists
      const existingArtist = await Artist.findById(id);
      if (!existingArtist) {
        return res.status(404).json({ error: "Artist not found" });
      }

      // Check for duplicate name (excluding current artist)
      if (name && name !== existingArtist.name) {
        const duplicateArtist = await Artist.find({ name });
        if (duplicateArtist.length > 0) {
          return res
            .status(400)
            .json({ error: "Artist with this name already exists" });
        }
      }

      // Update the artist
      const updateData = {};
      if (name) updateData.name = name;
      if (country) updateData.country = country;

      const result = await Artist.updateOne(id, updateData);

      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ error: "Artist not found or no changes made" });
      }

      res.json({
        message: "Artist updated successfully",
        artist: {
          artistId: parseInt(id),
          name: name || existingArtist.name,
          country: country || existingArtist.country,
        },
      });
    } catch (error) {
      console.error("Error updating artist:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  /**
   * Delete an artist
   *
   * @param {Object} req - Express request object
   * @param {Object} req.params - Route parameters
   * @param {string} req.params.id - Artist ID
   * @param {Object} res - Express response object
   * @returns {Object} JSON response confirming deletion
   */
  static async deleteArtist(req, res) {
    try {
      const { id } = req.params;

      // Check if artist exists
      const existingArtist = await Artist.findById(id);
      if (!existingArtist) {
        return res.status(404).json({ error: "Artist not found" });
      }

      // Check if artist has albums (optional - you might want to prevent deletion)
      const albums = await Album.find({ artistId: id });
      if (albums.length > 0) {
        return res.status(400).json({
          error:
            "Cannot delete artist with existing albums. Please delete albums first.",
        });
      }

      // Delete the artist
      const result = await Artist.deleteOne(id);

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Artist not found" });
      }

      res.json({ message: "Artist deleted successfully" });
    } catch (error) {
      console.error("Error deleting artist:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

module.exports = ArtistController;
