const { default: mongoose } = require("mongoose");

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
