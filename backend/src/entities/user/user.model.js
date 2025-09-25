const { default: mongoose } = require("mongoose");
const bcrypt = require("bcryptjs");

/**
 * User Model Schema
 * 
 * Defines the user data structure for the Music Store application.
 * Includes automatic password hashing and authentication methods.
 * 
 * Features:
 * - Unique username and email validation
 * - Automatic password hashing with bcrypt
 * - Password comparison method for authentication
 * - Pre-save middleware for security
 */
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

/**
 * Pre-save Middleware - Password Hashing
 * 
 * Automatically hashes the user's password before saving to database.
 * Only hashes if the password field has been modified to avoid unnecessary processing.
 * Uses bcrypt with salt rounds of 10 for secure password storage.
 */
userSchema.pre("save", async function (next) {
  // Skip hashing if password hasn't been modified
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Password Comparison Method
 * 
 * Compares a plain text password with the hashed password stored in database.
 * Used during login authentication to verify user credentials.
 * 
 * @param {string} candidatePassword - Plain text password to compare
 * @returns {Promise<boolean>} True if passwords match, false otherwise
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
