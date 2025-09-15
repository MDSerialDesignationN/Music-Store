const express = require("express");
const CartController = require("./cart.controller");
const { requireAuth } = require("../../../middleware/auth");

const cartRouter = express.Router();

cartRouter.get("/", requireAuth, CartController.getUserCart);
cartRouter.post("/", requireAuth, CartController.createCart);
cartRouter.put("/add", requireAuth, CartController.addItemToCart);
cartRouter.put("/remove", requireAuth, CartController.removeItemFromCart);

module.exports = cartRouter;
