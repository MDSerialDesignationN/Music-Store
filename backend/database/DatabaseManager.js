const mongoose = require('mongoose');

/**
 * DatabaseManager Class
 * 
 * Centralized database operations manager for MongoDB using Mongoose.
 * Provides a unified interface for common CRUD operations across all entities.
 * 
 * Features:
 * - Connection management
 * - Generic CRUD operations
 * - Error handling and logging
 * - Consistent API for all database interactions
 */
class DatabaseManager {
    /**
     * Connect to MongoDB
     * @param {string} uri - MongoDB connection string
     * @throws {Error} If connection fails
     */
    async connect(uri) {
        try {
            mongoose.connect(uri);
            console.log('Database connected successfully');
        } catch (error) {
            console.error('Database connection error:', error);
            throw error;
        }
    }

    /**
     * Disconnect from MongoDB
     * @throws {Error} If disconnection fails
     */
    async disconnect() {
        try {
            await mongoose.disconnect();
            console.log('Database disconnected successfully');
        } catch (error) {
            console.error('Database disconnection error:', error);
            throw error;
        }
    }

    /**
     * Create a new database entry
     * @param {mongoose.Model} model - Mongoose model to create entry for
     * @param {Object} data - Data to create the entry with
     * @returns {Promise<Object>} Created entry
     * @throws {Error} If creation fails
     */
    async createEntry(model, data) {
        try {
            const entry = await model.create(data);
            return await entry.save();
        } catch (error) {
            console.error('Error creating entry:', error);
            throw error;
        }
    }

    /**
     * Find database entries matching query
     * @param {mongoose.Model} model - Mongoose model to search
     * @param {Object} query - MongoDB query object
     * @returns {Promise<Array>} Array of matching entries
     * @throws {Error} If search fails
     */
    async findEntries(model, query) {
        try {
            return await model.find(query);
        } catch (error) {
            console.error('Error finding entries:', error);
            throw error;
        }
    }

    /**
     * Update a database entry
     * @param {mongoose.Model} model - Mongoose model to update
     * @param {Object} query - Query to find entry to update
     * @param {Object} updateData - Data to update the entry with
     * @returns {Promise<Object>} Update result
     * @throws {Error} If update fails
     */
    async updateEntry(model, query, updateData) {
        try {
            return await model.updateOne(query, updateData).exec();
        } catch (error) {
            console.error('Error updating entry:', error);
            throw error;
        }
    }

    /**
     * Delete a database entry
     * @param {mongoose.Model} model - Mongoose model to delete from
     * @param {Object} query - Query to find entry to delete
     * @returns {Promise<Object>} Deletion result
     * @throws {Error} If deletion fails
     */
    async deleteEntry(model, query) {
        try {
            return await model.deleteOne(query).exec();
        } catch (error) {
            console.error('Error deleting entry:', error);
            throw error;
        }
    }
}

// Export singleton instance to ensure consistent database connection across the app
module.exports = new DatabaseManager();