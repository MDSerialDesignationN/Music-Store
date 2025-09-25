/**
 * Order Entity Module Exports
 * 
 * Centralizes all order-related components for easy importing.
 * Provides order management model, controller, and routes.
 */

const OrderController = require("./order.controller");
const Order = require("./order.model");
const orderRouter = require("./order.route");

module.exports = {
  Order,
  OrderController,
  orderRouter
};