const express = require("express");
const { requireGuest, requireAuth } = require("../middleware/auth");
const DatabaseManager = require("../database/DatabaseManager");
const User = require("../database/models/User");
const authRouter = express.Router();

authRouter.post("/login", requireGuest, async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }

    // Find user by username or email
    const user = await DatabaseManager.findEntries(User, {
      $or: [{ username: username }, { email: username }],
    });

    if (!user || user.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const foundUser = user[0];
    const isValidPassword = await foundUser.comparePassword(password);

    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Create session
    req.session.userId = foundUser._id;
    req.session.username = foundUser.username;

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
});

// Check current session
authRouter.get("/session", async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const user = await DatabaseManager.findEntries(User, {
      _id: req.session.userId,
    });

    if (!user || user.length === 0) {
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
});

authRouter.post("/logout", requireAuth, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).json({ error: "Could not log out" });
    }
    res.json({ message: "Logout successful" });
  });
});

module.exports = authRouter;
