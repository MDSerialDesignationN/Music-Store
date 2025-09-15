const express = require("express");
const OrderController = require("./order.controller");
const { requireAuth } = require("../../../middleware/auth");

const orderRouter = express.Router();

orderRouter.get("/", requireAuth, OrderController.getUserOrders);
orderRouter.get("/history", requireAuth, OrderController.getUserOrderHistory);
orderRouter.post("/", requireAuth, OrderController.createOrder);

module.exports = orderRouter;
