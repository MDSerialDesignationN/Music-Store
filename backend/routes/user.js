const express = require("express");
const userRouter = express.Router();
const DatabaseManager = require("../database/DatabaseManager");
const User = require("../database/models/User");
const Cart = require("../database/models/Cart");

// Create new user (register)
userRouter.post("/", async (req, res) => {
  const { username, email, password } = req.body;
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
    await DatabaseManager.createEntry(Cart, {
      owner: user._id,
      items: [],
    });

    // Remove password from response
    const userObj = user.toObject();
    delete userObj.password;

    res.status(201).json({
      message: "User created successfully",
      user: userObj,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    if (error.code === 11000) {
      res
        .status(400)
        .json({ error: "User with this email or username already exists" });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

module.exports = userRouter;
