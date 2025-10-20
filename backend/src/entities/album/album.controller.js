const { Track } = require("../track");
const Album = require("./album.model");

/**
 * AlbumController Class
 *
 * Handles HTTP requests related to album operations.
 * Manages album catalog retrieval, individual album details,
 * and album filtering based on track availability.
 *
 * Features:
 * - All albums retrieval with artist and genre information
 * - Album filtering (only albums with tracks)
 * - Individual album details with track information
 * - Data transformation for clean API responses
 * - Genre-based album filtering
 */
class AlbumController {
  /**
   * Get All Albums
   *
   * Retrieves all albums from the catalog with artist and genre data.
   * Filters albums to only include those that have tracks (complete albums).
   *
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Object} JSON response with all available albums
   */
  static async getAllAlbums(req, res) {
    try {
      const albums = await Album.findWithDetails();
      await Promise.all(
        albums.map(async (album) => {
          const tracks = await Track.findByAlbumId(album.albumId);
          album.tracks = tracks;
        })
      );
      if (!albums || albums.length === 0) {
        return res.status(404).json({
          error: "There are no albums available.",
        });
      }

      res.json({
        message: "Albums retrieved successfully",
        albums: albums,
      });
    } catch (error) {
      console.error("Error retrieving albums:", error);
      res.status(500).json({
        error: "Internal Server Error while retrieving albums",
        details: error.message,
      });
    }
  }

  static async getAllAlbumsFiltered(req, res) {
    try {
      const albums = await Album.findWithDetails();

      if (!albums || albums.length === 0) {
        return res.status(404).json({
          error: "There are no albums available.",
        });
      }

      // Filter albums that have tracks (ensures complete album data)
      const albumsWithTracks = [];
      for (const album of albums) {
        const tracks = await Track.findByAlbumId(album.albumId);
        if (tracks.length > 0) {
          albumsWithTracks.push(album);
        }
      }

      if (albumsWithTracks.length === 0) {
        return res.status(404).json({
          error: "No albums with tracks available.",
        });
      }

      // Transform the albums to have cleaner, more readable field names
      const transformedAlbums = albumsWithTracks.map((album) => ({
        id: album.albumId,
        title: album.title,
        release_year: album.releaseYear,
        artist: {
          id: album.artistId,
          name: album.artistName,
          country: album.artistCountry,
        },
        genre: {
          id: album.genreId,
          name: album.genreName,
        },
        price: album.price.toFixed(2),
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

      // Validate ID format (should be numeric for MySQL)
      if (!/^\d+$/.test(id)) {
        return res.status(400).json({
          error: "Invalid album ID format",
        });
      }

      const albums = await Album.findWithDetails({ albumId: parseInt(id) });

      if (!albums || albums.length === 0) {
        return res.status(404).json({
          error: "Album not found",
        });
      }

      const album = albums[0];

      res.json({
        message: "Album retrieved successfully",
        album: {
          id: album.albumId,
          title: album.title,
          release_year: album.releaseYear,
          artist: {
            id: album.artistId,
            name: album.artistName,
            country: album.artistCountry,
          },
          genre: {
            id: album.genreId,
            name: album.genreName,
          },
          price: album.price,
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

  static async deleteAlbum(req, res) {
    try {
      const { id } = req.params;

      // Check if album exists
      const existingAlbum = await Album.findById(id);
      if (!existingAlbum) {
        return res.status(404).json({ error: "Album not found" });
      }

      // Check if album has tracks (optional - you might want to prevent deletion)
      const tracks = await Track.find({ albumId: id });
      if (tracks.length > 0) {
        return res.status(400).json({
          error:
            "Cannot delete album with existing tracks. Please delete tracks first.",
        });
      }

      // Delete the album
      const result = await Album.deleteOne(id);

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Album not found" });
      }

      res.json({ message: "Album deleted successfully" });
    } catch (error) {
      console.error("Error deleting album:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

module.exports = AlbumController;
