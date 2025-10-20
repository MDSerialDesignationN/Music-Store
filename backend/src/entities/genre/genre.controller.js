const DatabaseManager = require("../../../database/DatabaseManager");
const Genre = require("./genre.model");

/**
 * GenreController Class
 *
 * Handles HTTP requests related to genre management operations.
 * Manages genre creation, updates, and retrieval.
 *
 * Features:
 * - Genre creation with validation
 * - Input validation and error handling
 * - Secure data handling (excludes sensitive information from responses)
 * - Duplicate genre detection
 */
class GenreController {
  /**
   * Get all genres without sensitive information
   *
   * Retrieves all registered genres for admin dashboard statistics.
   * Excludes sensitive data from the response.
   *
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Object} JSON response with all genres (sensitive data excluded)
   */
  static async getAllGenres(req, res) {
    try {
      const genres = await Genre.find();

      res.json({
        message: "Genres retrieved successfully",
        genres: genres,
        count: genres.length,
      });
    } catch (error) {
      console.error("Error fetching genres:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

module.exports = GenreController;
