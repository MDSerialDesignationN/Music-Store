const DatabaseManager = require("../../../database/DatabaseManager");
const { Cart } = require("../cart");
const User = require("./user.model");

/**
 * UserController Class
 *
 * Handles HTTP requests related to user management operations.
 * Manages user creation, profile updates, and account operations.
 *
 * Features:
 * - User registration with automatic cart creation
 * - Input validation and error handling
 * - Password security (excludes passwords from responses)
 * - Duplicate user detection
 */
class UserController {
  /**
   * Get all users without password information
   *
   * Retrieves all registered users for admin dashboard statistics.
   * Excludes sensitive password data from the response.
   *
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Object} JSON response with all users (passwords excluded)
   */
  static async getAllUsers(req, res) {
    try {
      const users = await User.getAllWithoutPasswords();

      res.json({
        message: "Users retrieved successfully",
        users: users,
        count: users.length,
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  /**
   * Create a new user account
   *
   * Creates a new user with the provided credentials and automatically
   * creates an empty shopping cart for the user.
   *
   * @param {Object} req - Express request object
   * @param {Object} req.body - Request body containing user data
   * @param {string} req.body.username - Username for the new account
   * @param {string} req.body.email - Email address for the new account
   * @param {string} req.body.password - Password for the new account
   * @param {Object} res - Express response object
   * @returns {Object} JSON response with created user data (password excluded)
   */
  static async createUser(req, res) {
    const { username, email, password } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    try {
      // Check if user already exists
      const existingUser = await User.findByUsername(username);
      if (existingUser) {
        return res
          .status(400)
          .json({ error: "User with this username already exists" });
      }

      const existingEmail = await User.findByEmail(email);
      if (existingEmail) {
        return res
          .status(400)
          .json({ error: "User with this email already exists" });
      }

      // Create the user first
      const userResult = await User.create({
        username,
        email,
        password,
        isAdmin: req.body.isAdmin || 0, // Allow setting admin status, default to regular user
      });

      // Create an empty cart for the new user
      // This ensures every user has a cart ready for shopping
      await Cart.create(userResult.insertId);

      res.status(201).json({
        message: "User created successfully",
        user: {
          id: userResult.insertId,
          username,
          email,
          isAdmin: req.body.isAdmin || 0,
        },
      });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  /**
   * Update user details
   *
   * Allows admin to update user information including username, email, password, and admin status.
   *
   * @param {Object} req - Express request object
   * @param {Object} req.params - Request parameters
   * @param {string} req.params.userId - User ID to update
   * @param {Object} req.body - Request body with user data
   * @param {Object} res - Express response object
   */
  static async updateUser(req, res) {
    try {
      const { userId } = req.params;
      const { username, email, password, isAdmin } = req.body;

      // Check if user exists
      const existingUser = await User.findById(userId);
      if (!existingUser) {
        return res.status(404).json({ error: "User not found" });
      }

      // Check for duplicate username/email (excluding current user)
      if (username && username !== existingUser.username) {
        const duplicateUsername = await User.findByUsername(username);
        if (duplicateUsername && duplicateUsername.userId != userId) {
          return res.status(400).json({ error: "Username already exists" });
        }
      }

      if (email && email !== existingUser.email) {
        const duplicateEmail = await User.findByEmail(email);
        if (duplicateEmail && duplicateEmail.userId != userId) {
          return res.status(400).json({ error: "Email already exists" });
        }
      }

      // Update user
      const updateData = {};
      if (username) updateData.username = username;
      if (email) updateData.email = email;
      if (password) updateData.password = password;
      if (isAdmin !== undefined) updateData.isAdmin = isAdmin;

      const result = await User.updateOne(userId, updateData);

      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ error: "User not found or no changes made" });
      }

      res.json({
        message: "User updated successfully",
        user: {
          id: userId,
          username: username || existingUser.username,
          email: email || existingUser.email,
          isAdmin: isAdmin !== undefined ? !!isAdmin : !!existingUser.isAdmin,
        },
      });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  /**
   * Update user admin status
   *
   * Allows admin to promote/demote users to/from admin status.
   *
   * @param {Object} req - Express request object
   * @param {Object} req.params - Request parameters
   * @param {string} req.params.userId - User ID to update
   * @param {Object} req.body - Request body
   * @param {boolean} req.body.isAdmin - New admin status
   * @param {Object} res - Express response object
   */
  static async updateAdminStatus(req, res) {
    try {
      const { userId } = req.params;
      const { isAdmin } = req.body;

      if (isAdmin === undefined) {
        return res.status(400).json({ error: "isAdmin field is required" });
      }

      const result = await User.updateOne(userId, { isAdmin });

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({
        message: `User ${
          isAdmin ? "promoted to" : "demoted from"
        } admin successfully`,
        isAdmin: !!isAdmin,
      });
    } catch (error) {
      console.error("Error updating admin status:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

module.exports = UserController;
