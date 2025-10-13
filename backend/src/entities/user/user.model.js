const DatabaseManager = require("../../../database/DatabaseManager");
const bcrypt = require("bcryptjs");

/**
 * User Model
 *
 * Defines the user data structure and operations for the Music Store application.
 * Includes password hashing and authentication methods.
 *
 * Features:
 * - CRUD operations for users
 * - Password hashing with bcrypt
 * - Password comparison method for authentication
 * - MySQL-based data persistence
 */
class User {
  /**
   * Hash password using bcrypt
   * @param {string} password - Plain text password
   * @returns {Promise<string>} Hashed password
   */
  static async hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  /**
   * Compare password with hash
   * @param {string} candidatePassword - Plain text password
   * @param {string} hashedPassword - Hashed password from database
   * @returns {Promise<boolean>} True if passwords match
   */
  static async comparePassword(candidatePassword, hashedPassword) {
    return bcrypt.compare(candidatePassword, hashedPassword);
  }

  /**
   * Create a new user
   * @param {Object} userData - User data
   * @returns {Promise<Object>} Created user with ID
   */
  static async create(userData) {
    const hashedPassword = await this.hashPassword(userData.password);

    const data = {
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
      isAdmin: userData.isAdmin || 0, // Default to regular user (0)
    };

    return await DatabaseManager.createEntry("User", data);
  }

  /**
   * Find users by criteria
   * @param {Object} conditions - Search conditions
   * @param {Object} options - Additional options (orderBy, limit)
   * @returns {Promise<Array>} Array of users
   */
  static async find(conditions = {}, options = {}) {
    return await DatabaseManager.findEntries("User", conditions, options);
  }

  /**
   * Find a single user by ID
   * @param {number} userId - User ID
   * @returns {Promise<Object|null>} User or null
   */
  static async findById(userId) {
    const results = await DatabaseManager.findEntries("User", { userId });
    return results.length > 0 ? results[0] : null;
  }

  /**
   * Find a user by username
   * @param {string} username - Username
   * @returns {Promise<Object|null>} User or null
   */
  static async findByUsername(username) {
    const results = await DatabaseManager.findEntries("User", { username });
    return results.length > 0 ? results[0] : null;
  }

  /**
   * Find a user by email
   * @param {string} email - Email
   * @returns {Promise<Object|null>} User or null
   */
  static async findByEmail(email) {
    const results = await DatabaseManager.findEntries("User", { email });
    return results.length > 0 ? results[0] : null;
  }

  /**
   * Update a user
   * @param {number} userId - User ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Update result
   */
  static async updateOne(userId, updateData) {
    const data = {};
    if (updateData.username) data.username = updateData.username;
    if (updateData.email) data.email = updateData.email;
    if (updateData.password) {
      data.password = await this.hashPassword(updateData.password);
    }
    if (updateData.isAdmin !== undefined)
      data.isAdmin = updateData.isAdmin ? 1 : 0;

    return await DatabaseManager.updateEntry("User", { userId }, data);
  }

  /**
   * Delete a user
   * @param {number} userId - User ID
   * @returns {Promise<Object>} Deletion result
   */
  static async deleteOne(userId) {
    return await DatabaseManager.deleteEntry("User", { userId });
  }

  /**
   * Check if a user is admin
   * @param {number} userId - User ID
   * @returns {Promise<boolean>} True if user is admin
   */
  static async isAdmin(userId) {
    const user = await this.findById(userId);
    return user ? !!user.isAdmin : false;
  }

  /**
   * Get all users without passwords (for admin use)
   * @returns {Promise<Array>} Array of users without passwords
   */
  static async getAllWithoutPasswords() {
    const users = await DatabaseManager.findEntries("User");
    return users.map((user) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }
}

module.exports = User;
