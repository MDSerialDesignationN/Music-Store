/**
 * Music Store Backend Application
 * 
 * Main Express.js application file that configures the server,
 * middleware, database connection, and routing for the Music Store API.
 * 
 * Features:
 * - MongoDB database connection via DatabaseManager
 * - CORS configuration for frontend communication
 * - Session management for user authentication
 * - RESTful API routes under /api prefix
 */

var express = require('express');
var path = require('path');
var session = require('express-session');
var cors = require('cors');
const DatabaseManager = require('./database/DatabaseManager');
const router = require('./routes');
require('dotenv').config();
const { addUserInfo } = require('./middleware/auth');

var app = express();


/**
 * Database Connection Setup
 * 
 * Establishes connection to MySQL using configuration from environment variables.
 * Application will exit with error code 1 if database connection fails.
 */
(async () => {
  try {
    const dbConfig = {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'musicstore',
      port: process.env.DB_PORT || 3306
    };
    await DatabaseManager.connect(dbConfig);
  } catch (error) {
    console.error('Failed to connect to database:', error);
    process.exit(1);
  }
})();

// Express middleware configuration
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded request bodies
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

/**
 * CORS Configuration
 * 
 * Allows cross-origin requests from the frontend (React app).
 * Enables credentials (cookies/sessions) to be sent with requests.
 * Supports all necessary HTTP methods for the REST API.
 */
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

/**
 * Session Configuration
 * 
 * Sets up express-session for user authentication and state management.
 * Sessions are stored in memory (consider Redis for production).
 * Cookie expires after 24 hours of inactivity.
 */
app.use(session({
  secret: process.env.SESSION_SECRET || 'musicstore-session-secret',
  resave: false, // Don't save session if unmodified
  saveUninitialized: false, // Don't create session until something stored
  cookie: {
    secure: false, // Set to true in production with HTTPS
    maxAge: 1000 * 60 * 60 * 24 // 24 hours
  }
}));

// Add user authentication info to all requests
app.use(addUserInfo)

// Mount API routes under /api prefix
app.use('/api', router);

/**
 * Server Startup
 * 
 * Starts the Express server on the specified port.
 * Default port is 9080 if not specified in environment variables.
 */
const PORT = process.env.PORT || 9080;
app.listen(PORT, () => {
  console.log(`Music Store Backend server is running on port ${PORT}`);
});

module.exports = app;