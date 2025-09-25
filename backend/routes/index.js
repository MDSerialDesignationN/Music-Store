/**
 * Main API Router Configuration
 * 
 * Central routing configuration that mounts all entity-specific routers
 * under the /api prefix. Implements a modular routing structure where
 * each entity (user, album, cart, etc.) has its own router module.
 * 
 * API Endpoints:
 * - /api/auth - Authentication operations (login, logout, session)
 * - /api/user - User management operations
 * - /api/album - Album catalog operations
 * - /api/artist - Artist information operations
 * - /api/track - Individual track operations
 * - /api/cart - Shopping cart operations
 * - /api/order - Order management operations
 * - /api/seeding - Database seeding utilities (development)
 */

var express = require("express");
const { albumRouter } = require("../src/entities/album");
const { artistRouter } = require("../src/entities/artist");
const { cartRouter } = require("../src/entities/cart");
const { orderRouter } = require("../src/entities/order");
const { trackRouter } = require("../src/entities/track");
const { userRouter } = require("../src/entities/user");
const { seedingRouter } = require("../src/entities/seeding");
const { authRouter } = require("../src/entities/auth");

const router = express.Router();

// Mount entity routers with their respective path prefixes
router.use("/seeding", seedingRouter);  // Database seeding endpoints
router.use("/cart", cartRouter);        // Shopping cart operations
router.use("/user", userRouter);        // User management
router.use("/auth", authRouter);        // Authentication operations
router.use("/order", orderRouter);      // Order processing
router.use("/album", albumRouter);      // Album catalog
router.use("/track", trackRouter);      // Individual tracks
router.use("/artist", artistRouter);    // Artist information

module.exports = router;
