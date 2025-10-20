const DatabaseManager = require("../../../database/DatabaseManager");

/**
 * Genre Model
 *
 * Defines the genre data structure and operations for the Music Store application.
 *
 * Features:
 * - CRUD operations for genres
 * - MySQL-based data persistence
 */
class Genre {
  /**
   * Find genres by criteria
   * @param {Object} conditions - Search conditions
   * @param {Object} options - Additional options (orderBy, limit)
   * @returns {Promise<Array>} Array of genres
   */
  static async find(conditions = {}, options = {}) {
    return await DatabaseManager.findEntries("Genre", conditions, options);
  }

  /**
   * Find a single genre by ID
   * @param {number} genreId - Genre ID
   * @returns {Promise<Object|null>} Genre or null
   */
  static async findById(genreId) {
    const results = await DatabaseManager.findEntries("Genre", { genreId });
    return results.length > 0 ? results[0] : null;
  }
}

module.exports = Genre;
