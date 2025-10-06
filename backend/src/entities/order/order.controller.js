const Order = require("./order.model");
const { Cart } = require("../cart");

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
        try {
            const userId = req.session.userId;
            const orders = await Order.findByUserId(userId);
            
            if (!orders || orders.length === 0) {
                return res.status(404).json({ error: "Orders not found for this user" });
            }
            
            res.json({
                message: "Orders retrieved successfully",
                orders: orders,
            });
        } catch (error) {
            console.error("Error retrieving orders:", error);
            res.status(500).json({
                error: "Internal Server Error while retrieving orders",
                details: error.message,
            });
        }
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
            const userId = req.session.userId;
            const orders = await Order.findByUserIdWithItems(userId);

            if (!orders || orders.length === 0) {
                return res
                    .status(404)
                    .json({ error: "No order history found for this user" });
            }

            // Transform orders to have cleaner, more readable field names
            const transformedOrders = orders.map((order) => ({
                id: order.orderId,
                owner: order.userId,
                order_date: order.orderDate,
                items: order.items.map((item) => ({
                    album: {
                        id: item.albumId,
                        title: item.album.title,
                        price: item.album.price,
                        artist: {
                            name: item.album.artistName
                        }
                    },
                    quantity: item.quantity,
                })),
            }));

            res.json({
                message: "Order history retrieved successfully",
                orders: transformedOrders,
            });
        } catch (error) {
            console.error("Error fetching order history:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    static async createOrder(req, res) {
        try {
            const userId = req.session.userId;
            const cart = await Cart.findWithItems(userId);
            
            if (!cart) {
                return res.status(404).json({ error: "Cart not found for this user" });
            }
            
            if (cart.items.length === 0) {
                return res.status(400).json({ error: "Cart is empty" });
            }

            // Create order with cart items
            const orderItems = cart.items.map(item => ({
                albumId: item.albumId,
                quantity: item.quantity
            }));

            const order = await Order.create(userId, orderItems);
            
            // Clear the cart after successful order creation
            await Cart.clearItems(cart.cartId);
            
            res.status(201).json({
                message: "Order created successfully",
                order: {
                    id: order.orderId,
                    owner: order.userId,
                    order_date: order.orderDate,
                    items: order.items
                },
            });
        } catch (error) {
            console.error("Error creating order:", error);
            res.status(500).json({
                error: "Internal Server Error while creating order",
                details: error.message,
            });
        }
    }
}

module.exports = OrderController;
