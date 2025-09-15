const { default: mongoose } = require("mongoose");

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
