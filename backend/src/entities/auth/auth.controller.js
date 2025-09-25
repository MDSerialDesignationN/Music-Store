const { Cart } = require("../cart");
const { User } = require("../user");
const DatabaseManager = require("../../../database/DatabaseManager");

/**
 * AuthController Class
 * 
 * Handles user authentication operations including login, logout,
 * and session management for the Music Store application.
 * 
 * Features:
 * - User login with username/email support
 * - Session creation and validation
 * - Automatic cart creation for existing users without carts
 * - Secure logout with session destruction
 * - Current session information retrieval
 */
class AuthController {
    /**
     * User Login
     * 
     * Authenticates a user with username/email and password.
     * Creates a session and ensures the user has a shopping cart.
     * 
     * @param {Object} req - Express request object
     * @param {Object} req.body - Request body containing login credentials
     * @param {string} req.body.username - Username or email for login
     * @param {string} req.body.password - User's password
     * @param {Object} res - Express response object
     * @returns {Object} JSON response with user data and session info
     */
    static async login(req, res) {
        try {
            const { username, password } = req.body;

            // Validate required fields
            if (!username || !password) {
                return res
                    .status(400)
                    .json({ error: "Username and password are required" });
            }

            // Find user by username or email (flexible login)
            const user = await DatabaseManager.findEntries(User, {
                $or: [{ username: username }, { email: username }],
            });

            if (!user || user.length === 0) {
                return res.status(401).json({ error: "Invalid credentials" });
            }

            const foundUser = user[0];
            // Use the model's password comparison method (handles bcrypt)
            const isValidPassword = await foundUser.comparePassword(password);

            if (!isValidPassword) {
                return res.status(401).json({ error: "Invalid credentials" });
            }

            // Create user session
            req.session.userId = foundUser._id;
            req.session.username = foundUser.username;

            // Ensure user has a shopping cart (backwards compatibility)
            const existingCart = await DatabaseManager.findEntries(Cart, {
                owner: foundUser._id,
            });

            if (!existingCart || existingCart.length === 0) {
                await DatabaseManager.createEntry(Cart, {
                    owner: foundUser._id,
                    items: [],
                });
                console.log("Created cart for existing user:", foundUser.username);
            }

            res.json({
                message: "Login successful",
                user: {
                    id: foundUser._id,
                    username: foundUser.username,
                    email: foundUser.email,
                },
            });
        } catch (error) {
            console.error("Login error:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    /**
     * Get Current Session Information
     * 
     * Retrieves the current user's session data if authenticated.
     * Validates that the session user still exists in the database.
     * 
     * @param {Object} req - Express request object with session data
     * @param {Object} res - Express response object
     * @returns {Object} JSON response with current user data or error
     */
    static async getSession(req, res) {
        try {
            // Check if user is authenticated
            if (!req.session.userId) {
                return res.status(401).json({ error: "Not authenticated" });
            }

            // Verify user still exists in database
            const user = await DatabaseManager.findEntries(User, {
                _id: req.session.userId,
            });

            if (!user || user.length === 0) {
                // User was deleted, destroy invalid session
                req.session.destroy();
                return res.status(401).json({ error: "User not found" });
            }

            const foundUser = user[0];
            res.json({
                user: {
                    id: foundUser._id,
                    username: foundUser.username,
                    email: foundUser.email,
                },
            });
        } catch (error) {
            console.error("Session check error:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
    /**
     * User Logout
     * 
     * Destroys the user's session and logs them out of the system.
     * Clears all session data including authentication status.
     * 
     * @param {Object} req - Express request object with session data
     * @param {Object} res - Express response object
     * @returns {Object} JSON response confirming logout success
     */
    static async logout(req, res) {
        req.session.destroy((err) => {
            if (err) {
                console.error("Logout error:", err);
                return res.status(500).json({ error: "Could not log out" });
            }
            res.json({ message: "Logout successful" });
        });
    }
}

module.exports = AuthController;
