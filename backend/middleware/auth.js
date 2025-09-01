// Middleware to check if user is authenticated
const requireAuth = (req, res, next) => {
    if (req.session && req.session.userId) {
        next();
    } else {
        res.status(401).json({ error: 'Authentication required' });
    }
};

// Middleware to check if user is already logged in
const requireGuest = (req, res, next) => {
    if (req.session && req.session.userId) {
        res.status(400).json({ error: 'Already logged in' });
    } else {
        next();
    }
};

// Middleware to add user info to request
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