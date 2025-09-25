/**
 * Authentication Middleware Functions
 * 
 * Provides middleware functions for handling user authentication
 * and session management throughout the application.
 */

/**
 * Middleware to check if user is authenticated
 * Protects routes that require user login
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const requireAuth = (req, res, next) => {
    if (req.session && req.session.userId) {
        next();
    } else {
        res.status(401).json({ error: 'Authentication required' });
    }
};

/**
 * Middleware to check if user is already logged in
 * Prevents authenticated users from accessing guest-only routes (login, register)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const requireGuest = (req, res, next) => {
    if (req.session && req.session.userId) {
        res.status(400).json({ error: 'Already logged in' });
    } else {
        next();
    }
};

/**
 * Middleware to add user authentication info to all requests
 * Adds isAuthenticated and userId properties to request object
 * Used globally to make user info available in all route handlers
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const addUserInfo = (req, res, next) => {
    req.isAuthenticated = !!(req.session && req.session.userId);
    req.userId = req.session ? req.session.userId : null;
    next();
};

module.exports = {
    requireAuth,
    requireGuest,
    addUserInfo
};