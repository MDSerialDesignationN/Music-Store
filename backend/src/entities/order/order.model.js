const { default: mongoose } = require("mongoose");

/**
 * Order Model Schema
 * 
 * Defines the order data structure for completed purchases.
 * Orders capture a snapshot of cart items at the time of purchase.
 * 
 * Features:
 * - User ownership through ObjectId reference
 * - Array of ordered items with album references and quantities
 * - Automatic timestamp for order creation
 * - Quantity validation (minimum 1)
 * - Support for populated album data
 */
const orderSchema = new mongoose.Schema({
    owner: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    items: [
        {
            album: { type: mongoose.Types.ObjectId, ref: "Album" },
            quantity: { type: Number, required: true, min: 1 }
        }
    ],
    order_date: { type: Date, default: Date.now }
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
