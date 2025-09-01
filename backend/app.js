var express = require('express');
var path = require('path');
var session = require('express-session');
var cors = require('cors');
const DatabaseManager = require('./database/DatabaseManager');
const router = require('./routes');
require('dotenv').config();
const { addUserInfo } = require('./middleware/auth');


var app = express();


// Database connection in async function
(async () => {
  try {
    await DatabaseManager.connect(process.env.MONGO_URI);
  } catch (error) {
    console.error('Failed to connect to database:', error);
    process.exit(1);
  }
})();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'musicstore-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true in production with HTTPS
    maxAge: 1000 * 60 * 60 * 24 // 24 hours
  }
}));

app.use(addUserInfo)
app.use('/api', router);

// error handler
const PORT = process.env.PORT || 9080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;