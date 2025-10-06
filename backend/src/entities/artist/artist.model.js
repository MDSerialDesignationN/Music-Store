const DatabaseManager = require('../../../database/DatabaseManager');

/**
 * Artist Model
 * 
 * Defines the artist data structure and operations for the Music Store catalog.
 * Artists are referenced by albums and provide additional metadata.
 * 
 * Features:
 * - CRUD operations for artists
 * - Artist name and country tracking
 * - MySQL-based data persistence
 * - Data validation and formatting
 */
class Artist {
    /**
     * Create a new artist
     * @param {Object} artistData - Artist data
     * @returns {Promise<Object>} Created artist with ID
     */
    static async create(artistData) {
        const data = {
            name: artistData.name,
            country: artistData.country
        };
        
        return await DatabaseManager.createEntry('Artist', data);
    }

    /**
     * Find artists by criteria
     * @param {Object} conditions - Search conditions
     * @param {Object} options - Additional options (orderBy, limit)
     * @returns {Promise<Array>} Array of artists
     */
    static async find(conditions = {}, options = {}) {
        return await DatabaseManager.findEntries('Artist', conditions, options);
    }

    /**
     * Find a single artist by ID
     * @param {number} artistId - Artist ID
     * @returns {Promise<Object|null>} Artist or null
     */
    static async findById(artistId) {
        const results = await DatabaseManager.findEntries('Artist', { artistId });
        return results.length > 0 ? results[0] : null;
    }

    /**
     * Update an artist
     * @param {number} artistId - Artist ID
     * @param {Object} updateData - Data to update
     * @returns {Promise<Object>} Update result
     */
    static async updateOne(artistId, updateData) {
        const data = {};
        if (updateData.name) data.name = updateData.name;
        if (updateData.country) data.country = updateData.country;
        
        return await DatabaseManager.updateEntry('Artist', { artistId }, data);
    }

    /**
     * Delete an artist
     * @param {number} artistId - Artist ID
     * @returns {Promise<Object>} Deletion result
     */
    static async deleteOne(artistId) {
        return await DatabaseManager.deleteEntry('Artist', { artistId });
    }
}

module.exports = Artist;
