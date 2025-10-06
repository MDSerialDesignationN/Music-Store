const DatabaseManager = require('../../../database/DatabaseManager');

/**
 * Track Model
 * 
 * Defines individual track data structure and operations within albums.
 * Tracks belong to albums and contain timing information.
 * 
 * Features:
 * - CRUD operations for tracks
 * - Track title and duration tracking
 * - Album reference for data relationships
 * - MySQL-based data persistence
 * - Used for album completeness validation
 */
class Track {
    /**
     * Create a new track
     * @param {Object} trackData - Track data
     * @returns {Promise<Object>} Created track with ID
     */
    static async create(trackData) {
        const data = {
            title: trackData.title,
            durationSeconds: trackData.duration_seconds || trackData.durationSeconds,
            albumId: trackData.album_id || trackData.albumId
        };
        
        return await DatabaseManager.createEntry('Track', data);
    }

    /**
     * Find tracks by criteria
     * @param {Object} conditions - Search conditions
     * @param {Object} options - Additional options (orderBy, limit)
     * @returns {Promise<Array>} Array of tracks
     */
    static async find(conditions = {}, options = {}) {
        return await DatabaseManager.findEntries('Track', conditions, options);
    }

    /**
     * Find tracks by album ID
     * @param {number} albumId - Album ID
     * @returns {Promise<Array>} Array of tracks
     */
    static async findByAlbumId(albumId) {
        return await DatabaseManager.findEntries('Track', { albumId }, { orderBy: 'trackId ASC' });
    }

    /**
     * Find a single track by ID
     * @param {number} trackId - Track ID
     * @returns {Promise<Object|null>} Track or null
     */
    static async findById(trackId) {
        const results = await DatabaseManager.findEntries('Track', { trackId });
        return results.length > 0 ? results[0] : null;
    }

    /**
     * Update a track
     * @param {number} trackId - Track ID
     * @param {Object} updateData - Data to update
     * @returns {Promise<Object>} Update result
     */
    static async updateOne(trackId, updateData) {
        const data = {};
        if (updateData.title) data.title = updateData.title;
        if (updateData.durationSeconds || updateData.duration_seconds) {
            data.durationSeconds = updateData.durationSeconds || updateData.duration_seconds;
        }
        if (updateData.albumId || updateData.album_id) {
            data.albumId = updateData.albumId || updateData.album_id;
        }
        
        return await DatabaseManager.updateEntry('Track', { trackId }, data);
    }

    /**
     * Delete a track
     * @param {number} trackId - Track ID
     * @returns {Promise<Object>} Deletion result
     */
    static async deleteOne(trackId) {
        return await DatabaseManager.deleteEntry('Track', { trackId });
    }

    /**
     * Delete tracks by album ID
     * @param {number} albumId - Album ID
     * @returns {Promise<Object>} Deletion result
     */
    static async deleteByAlbumId(albumId) {
        return await DatabaseManager.deleteEntry('Track', { albumId });
    }
}

module.exports = Track;
