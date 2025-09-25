/**
 * Seeding Entity Module Exports
 * 
 * Centralizes all database seeding components for easy importing.
 * Provides development/testing utilities for database population.
 */

const SeedingController = require("./seeding.controller");
const seedingRouter = require("./seeding.route");

module.exports = {
  SeedingController,
  seedingRouter
};