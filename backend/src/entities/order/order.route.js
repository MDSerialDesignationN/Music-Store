/**
 * Order Routes
 * 
 * Defines HTTP routes for order management operations.
 * All routes require user authentication for security.
 * 
 * Routes:
 * - GET / - Get user's basic orders
 * - GET /history - Get detailed order history with populated data
 * - POST / - Create new order from cart contents
 */

const express = require("express");
const OrderController = require("./order.controller");
const { requireAuth } = require("../../../middleware/auth");

const orderRouter = express.Router();

// Get user's orders - basic order data without population
orderRouter.get("/", requireAuth, OrderController.getUserOrders);

// Get order history - detailed orders with album/artist data
orderRouter.get("/history", requireAuth, OrderController.getUserOrderHistory);

// Create new order - converts cart to order
orderRouter.post("/", requireAuth, OrderController.createOrder);

module.exports = orderRouter;
