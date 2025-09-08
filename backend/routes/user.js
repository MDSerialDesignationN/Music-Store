const express = require("express");
const userRouter = express.Router();
const DatabaseManager = require("../database/DatabaseManager");
const User = require("../database/models/User");

// Create new user (register)
userRouter.post("/", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  await DatabaseManager.createEntry(User, {
    username,
    email,
    password,
  })
    .then((user) => {
      // Remove password from response
      const userObj = user.toObject();
      delete userObj.password;
      res.status(201).json({
        message: "User created successfully",
        user: userObj,
      });
    })
    .catch((error) => {
      console.error("Error creating user:", error);
      if (error.code === 11000) {
        res
          .status(400)
          .json({ error: "User with this email or username already exists" });
      } else {
        res.status(500).json({ error: "Internal Server Error" });
      }
    });
});

module.exports = userRouter;
