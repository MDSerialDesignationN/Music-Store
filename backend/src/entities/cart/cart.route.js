/**
 * Cart Routes
 * 
 * Defines HTTP routes for shopping cart operations.
 * All routes require user authentication.
 * 
 * Routes:
 * - GET / - Get user's cart with populated item data
 * - POST / - Create new cart (manual creation)
 * - PUT /add - Add item to cart
 * - PUT /remove - Remove item from cart
 */

const express = require("express");
const CartController = require("./cart.controller");
const { requireAuth } = require("../../../middleware/auth");

const cartRouter = express.Router();

// Get user's cart - retrieves cart with populated album/artist data
cartRouter.get("/", requireAuth, CartController.getUserCart);

// Create cart - manual cart creation (usually done automatically)
cartRouter.post("/", requireAuth, CartController.createCart);

// Add item to cart - adds album with specified quantity
cartRouter.put("/add", requireAuth, CartController.addItemToCart);

// Remove item from cart - removes or decreases quantity
cartRouter.put("/remove", requireAuth, CartController.removeItemFromCart);

module.exports = cartRouter;
