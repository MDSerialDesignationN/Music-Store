const express = require("express");
const DatabaseManager = require("../database/DatabaseManager");
const Cart = require("../database/models/Cart");
const { requireAuth } = require("../middleware/auth");
const Order = require("../database/models/Orders");

const orderRouter = express.Router();

orderRouter.get("/", requireAuth, async (req, res) => {
  const ownerId = req.session.userId;
  const orders = await DatabaseManager.findEntries(Order, { owner: ownerId });
  if (!orders || orders.length === 0) {
    return res.status(404).json({ error: "Orders not found for this user" });
  }
  res.json({
    message: "Orders retrieved successfully",
    orders: orders,
  });
});

// Get order history with populated album and artist data
orderRouter.get("/history", requireAuth, async (req, res) => {
  try {
    const ownerId = req.session.userId;
    const orders = await DatabaseManager.findEntries(Order, { owner: ownerId });

    if (!orders || orders.length === 0) {
      return res
        .status(404)
        .json({ error: "No order history found for this user" });
    }

    // Populate each order with album and artist data
    const populatedOrders = await Promise.all(
      orders.map(async (order) => {
        await order.populate({
          path: "items.album",
          populate: {
            path: "artist_id",
            select: "name country",
          },
        });

        // Transform the order items to have cleaner field names
        const transformedOrder = {
          ...order.toObject(),
          items: order.items.map((item) => ({
            album: {
              _id: item.album._id,
              title: item.album.title,
              price: item.album.price,
              artist: item.album.artist_id,
            },
            quantity: item.quantity,
          })),
        };

        return transformedOrder;
      })
    );

    // Sort orders by date (newest first)
    populatedOrders.sort(
      (a, b) => new Date(b.order_date) - new Date(a.order_date)
    );

    res.json({
      message: "Order history retrieved successfully",
      orders: populatedOrders,
    });
  } catch (error) {
    console.error("Error fetching order history:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

orderRouter.post("/", requireAuth, async (req, res) => {
  const ownerId = req.session.userId;
  const cart = await DatabaseManager.findEntries(Cart, { owner: ownerId });
  if (!cart || cart.length === 0) {
    return res.status(404).json({ error: "Cart not found for this user" });
  }
  const userCart = cart[0];
  if (userCart.items.length === 0) {
    return res.status(400).json({ error: "Cart is empty" });
  }
  const order = await DatabaseManager.createEntry(Order, {
    owner: ownerId,
    items: userCart.items,
  });
  userCart.items = [];
  await userCart.save();
  res.status(201).json({
    message: "Order created successfully",
    order: order,
  });
});

module.exports = orderRouter;
