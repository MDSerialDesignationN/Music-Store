const express = require("express");
const DatabaseManager = require("../database/DatabaseManager");
const Cart = require("../database/models/Cart");
const { requireAuth } = require("../middleware/auth");
const Order = require("../database/models/Orders");

const orderRouter = express.Router();

orderRouter.get('/', requireAuth, async (req, res) => {
    const ownerId = req.session.userId;
    const orders = await DatabaseManager.findEntries(Order, { owner: ownerId })
    if (!orders || orders.length === 0) {
        return res.status(404).json({ error: 'Orders not found for this user' });
    }
    res.json({
        message: 'Orders retrieved successfully',
        orders: orders
    });
})


orderRouter.post('/', requireAuth, async (req, res) => {
    const ownerId = req.session.userId;
    const cart = await DatabaseManager.findEntries(Cart, { owner: ownerId })
    if (!cart || cart.length === 0) {
        return res.status(404).json({ error: 'Cart not found for this user' });
    }
    const userCart = cart[0];
    if (userCart.items.length === 0) {
        return res.status(400).json({ error: 'Cart is empty' });
    }
    const order = await DatabaseManager.createEntry(Order, { owner: ownerId, items: userCart.items, createdAt: new Date() })
    userCart.items = [];
    await userCart.save();
    res.status(201).json({
        message: 'Order created successfully',
        order: order
    });
})

module.exports = orderRouter;
