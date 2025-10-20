const DatabaseManager = require("../../../database/DatabaseManager");

/**
 * Album Model
 *
 * Defines the album data structure and operations for the Music Store catalog.
 * Albums are linked to artists and genres through foreign key references.
 *
 * Features:
 * - CRUD operations for albums
 * - Artist and genre relationship support
 * - MySQL-based data persistence
 * - Data validation and formatting
 */
class Album {
  /**
   * Create a new album
   * @param {Object} albumData - Album data
   * @returns {Promise<Object>} Created album with ID
   */
  static async create(albumData) {
    const data = {
      title: albumData.title,
      releaseYear: albumData.release_year || albumData.releaseYear,
      artistId: albumData.artist_id || albumData.artistId,
      genreId: albumData.genre_id || albumData.genreId,
      price: albumData.price || 9.99,
    };

    return await DatabaseManager.createEntry("Album", data);
  }

  /**
   * Find albums by criteria
   * @param {Object} conditions - Search conditions
   * @param {Object} options - Additional options (joins, orderBy, limit)
   * @returns {Promise<Array>} Array of albums
   */
  static async find(conditions = {}, options = {}) {
    return await DatabaseManager.findEntries("Album", conditions, options);
  }

  /**
   * Find a single album by ID
   * @param {number} albumId - Album ID
   * @returns {Promise<Object|null>} Album or null
   */
  static async findById(albumId) {
    const results = await DatabaseManager.findEntries("Album", { albumId });
    return results.length > 0 ? results[0] : null;
  }

  /**
   * Find albums with artist and genre information
   * @param {Object} conditions - Search conditions
   * @returns {Promise<Array>} Array of albums with populated data
   */
  static async findWithDetails(conditions = {}) {
    const options = {
      joins: `
                LEFT JOIN Artist ON Album.artistId = Artist.artistId
                LEFT JOIN Genre ON Album.genreId = Genre.genreId
            `,
    };

    let sql = `
            SELECT 
                Album.*,
                Artist.name as artistName,
                Artist.country as artistCountry,
                Genre.name as genreName
            FROM Album
            ${options.joins}
        `;

    const params = [];
    if (Object.keys(conditions).length > 0) {
      const whereClause = Object.keys(conditions)
        .map((key) => `Album.${key} = ?`)
        .join(" AND ");
      sql += ` WHERE ${whereClause}`;
      params.push(...Object.values(conditions));
    }

    return await DatabaseManager.query(sql, params);
  }

  /**
   * Update an album
   * @param {number} albumId - Album ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Update result
   */
  static async updateOne(albumId, updateData) {
    const data = {};
    if (updateData.title) data.title = updateData.title;
    if (updateData.releaseYear || updateData.release_year) {
      data.releaseYear = updateData.releaseYear || updateData.release_year;
    }
    if (updateData.artistId || updateData.artist_id) {
      data.artistId = updateData.artistId || updateData.artist_id;
    }
    if (updateData.genreId || updateData.genre_id) {
      data.genreId = updateData.genreId || updateData.genre_id;
    }
    if (updateData.price) data.price = updateData.price;

    return await DatabaseManager.updateEntry("Album", { albumId }, data);
  }

  /**
   * Delete an album
   * @param {number} albumId - Album ID
   * @returns {Promise<Object>} Deletion result
   */
  static async deleteOne(albumId) {
    return await DatabaseManager.deleteEntry("Album", { albumId });
  }
}

module.exports = Album;
