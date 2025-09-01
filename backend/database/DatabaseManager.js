const mongoose = require('mongoose');

class DatabaseManager {
    async connect(uri) {
        try {
            mongoose.connect(uri);
            console.log('Database connected successfully');
        } catch (error) {
            console.error('Database connection error:', error);
            throw error;
        }
    }

    async disconnect() {
        try {
            await mongoose.disconnect();
            console.log('Database disconnected successfully');
        } catch (error) {
            console.error('Database disconnection error:', error);
            throw error;
        }
    }

    async createEntry(model, data) {
        try {
            const entry = await model.create(data);
            return await entry.save();
        } catch (error) {
            console.error('Error creating entry:', error);
            throw error;
        }
    }

    async findEntries(model, query) {
        try {
            return await model.find(query);
        } catch (error) {
            console.error('Error finding entries:', error);
            throw error;
        }
    }

    async updateEntry(model, query, updateData) {
        try {
            return await model.updateOne(query, updateData).exec();
        } catch (error) {
            console.error('Error updating entry:', error);
            throw error;
        }
    }

    async deleteEntry(model, query) {
        try {
            return await model.deleteOne(query).exec();
        } catch (error) {
            console.error('Error deleting entry:', error);
            throw error;
        }
    }
}

module.exports = new DatabaseManager();