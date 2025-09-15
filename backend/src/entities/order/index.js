const OrderController = require("./order.controller");
const Order = require("./order.model");
const orderRouter = require("./order.route");

module.exports = {
  Order,
  OrderController,
  orderRouter
};