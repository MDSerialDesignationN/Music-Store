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
            // Create the user first
            const user = await DatabaseManager.createEntry(User, {
                username,
                email,
                password,
            });

            // Create an empty cart for the new user
            // This ensures every user has a cart ready for shopping
            await DatabaseManager.createEntry(Cart, {
                owner: user._id,
                items: [],
            });

            // Remove password from response for security
            const userObj = user.toObject();
            delete userObj.password;

            res.status(201).json({
                message: "User created successfully",
                user: userObj,
            });
        } catch (error) {
            console.error("Error creating user:", error);

            // Handle duplicate user error (MongoDB error code 11000)
            if (error.code === 11000) {
                res
                    .status(400)
                    .json({ error: "User with this email or username already exists" });
            } else {
                res.status(500).json({ error: "Internal Server Error" });
            }
        }
    }
}

module.exports = UserController;
