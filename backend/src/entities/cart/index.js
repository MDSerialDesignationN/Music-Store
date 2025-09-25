/**
 * Cart Entity Module Exports
 * 
 * Centralizes all cart-related components for easy importing.
 * Provides shopping cart model, controller, and routes.
 */

const CartController = require("./cart.controller");
const Cart = require("./cart.model");
const cartRouter = require("./cart.route");

module.exports = {
  Cart,
  CartController,
  cartRouter
};