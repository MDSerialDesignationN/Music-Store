const DatabaseManager = require('../DatabaseManager');

/**
 * Genre Model
 * 
 * Defines music genre data structure and operations for album categorization.
 * Simple model for music genre classification.
 * 
 * Features:
 * - CRUD operations for genres
 * - Referenced by albums for categorization
 * - Used in album filtering and search
 * - MySQL-based data persistence
 */
class Genre {
    /**
     * Create a new genre
     * @param {Object} genreData - Genre data
     * @returns {Promise<Object>} Created genre with ID
     */
    static async create(genreData) {
        const data = {
            name: genreData.name
        };
        
        return await DatabaseManager.createEntry('Genre', data);
    }

    /**
     * Find genres by criteria
     * @param {Object} conditions - Search conditions
     * @param {Object} options - Additional options (orderBy, limit)
     * @returns {Promise<Array>} Array of genres
     */
    static async find(conditions = {}, options = {}) {
        return await DatabaseManager.findEntries('Genre', conditions, options);
    }

    /**
     * Find a single genre by ID
     * @param {number} genreId - Genre ID
     * @returns {Promise<Object|null>} Genre or null
     */
    static async findById(genreId) {
        const results = await DatabaseManager.findEntries('Genre', { genreId });
        return results.length > 0 ? results[0] : null;
    }

    /**
     * Update a genre
     * @param {number} genreId - Genre ID
     * @param {Object} updateData - Data to update
     * @returns {Promise<Object>} Update result
     */
    static async updateOne(genreId, updateData) {
        const data = {};
        if (updateData.name) data.name = updateData.name;
        
        return await DatabaseManager.updateEntry('Genre', { genreId }, data);
    }

    /**
     * Delete a genre
     * @param {number} genreId - Genre ID
     * @returns {Promise<Object>} Deletion result
     */
    static async deleteOne(genreId) {
        return await DatabaseManager.deleteEntry('Genre', { genreId });
    }
}

module.exports = Genre;
