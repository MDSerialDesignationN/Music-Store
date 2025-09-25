const DatabaseManager = require("../../../database/DatabaseManager");
const Order = require("./order.model");

/**
 * OrderController Class
 * 
 * Handles HTTP requests related to order management operations.
 * Manages order retrieval, order history with populated data,
 * and order creation from cart contents.
 * 
 * Features:
 * - User-specific order retrieval
 * - Order history with populated album and artist data
 * - Order creation workflow
 * - Data transformation for clean API responses
 */
class OrderController {
    /**
     * Get User's Orders (Basic)
     * 
     * Retrieves all orders for the authenticated user without population.
     * Returns basic order data with item references.
     * 
     * @param {Object} req - Express request object with user session
     * @param {Object} res - Express response object
     * @returns {Object} JSON response with user's orders
     */
    static async getUserOrders(req, res) {
        const ownerId = req.session.userId;
        const orders = await DatabaseManager.findEntries(Order, { owner: ownerId });
        
        if (!orders || orders.length === 0) {
            return res.status(404).json({ error: "Orders not found for this user" });
        }
        
        res.json({
            message: "Orders retrieved successfully",
            orders: orders,
        });
    }

    /**
     * Get User's Order History (Detailed)
     * 
     * Retrieves all orders for the authenticated user with full album and artist data.
     * Populates order items with complete product information for display.
     * 
     * @param {Object} req - Express request object with user session
     * @param {Object} res - Express response object
     * @returns {Object} JSON response with detailed order history
     */
    static async getUserOrderHistory(req, res) {
        try {
            const ownerId = req.session.userId;
            const orders = await DatabaseManager.findEntries(Order, { owner: ownerId });

            if (!orders || orders.length === 0) {
                return res
                    .status(404)
                    .json({ error: "No order history found for this user" });
            }

            // Populate each order with complete album and artist data
            const populatedOrders = await Promise.all(
                orders.map(async (order) => {
                    await order.populate({
                        path: "items.album",
                        populate: {
                            path: "artist_id",
                            select: "name country",
                        },
                    });

                    // Transform the order items to have cleaner, more readable field names
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
    }

    static async createOrder(req, res) {
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
    }
}

module.exports = OrderController;
