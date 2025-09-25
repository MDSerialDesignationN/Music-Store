const { default: mongoose } = require("mongoose");

/**
 * Cart Model Schema
 * 
 * Defines the shopping cart data structure for users.
 * Each user has one cart that contains multiple album items with quantities.
 * 
 * Features:
 * - User ownership through ObjectId reference
 * - Array of cart items with album references
 * - Quantity validation (minimum 1)
 * - Support for populated album data
 * - Flexible item management (add, remove, update quantities)
 */
const cartSchema = new mongoose.Schema({
    owner: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    items: [
        {
            album: { type: mongoose.Types.ObjectId, ref: "Album" },
            quantity: { type: Number, required: true, min: 1 }
        }
    ]
});

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
