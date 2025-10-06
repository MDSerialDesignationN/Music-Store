const DatabaseManager = require('../../../database/DatabaseManager');

/**
 * Order Model
 * 
 * Defines the order data structure and operations for completed purchases.
 * Orders capture a snapshot of cart items at the time of purchase.
 * Uses separate Order and OrderItem tables following MySQL schema.
 * 
 * Features:
 * - CRUD operations for orders and order items
 * - User ownership through foreign key reference
 * - Order items with album references and quantities
 * - Automatic timestamp for order creation
 * - MySQL-based data persistence
 */
class Order {
    /**
     * Create a new order
     * @param {number} userId - User ID
     * @param {Array} items - Array of items with albumId and quantity
     * @returns {Promise<Object>} Created order with items
     */
    static async create(userId, items = []) {
        // Create the order first
        const orderData = {
            userId,
            orderDate: new Date().toISOString().split('T')[0] // YYYY-MM-DD format
        };
        
        const orderResult = await DatabaseManager.createEntry('Order', orderData);
        const orderId = orderResult.insertId;
        
        // Add order items
        const orderItems = [];
        for (const item of items) {
            const orderItemResult = await DatabaseManager.createEntry('OrderItem', {
                orderId,
                albumId: item.albumId,
                quantity: item.quantity
            });
            orderItems.push({
                orderItemId: orderItemResult.insertId,
                ...item
            });
        }
        
        return {
            orderId,
            userId,
            orderDate: orderData.orderDate,
            items: orderItems
        };
    }

    /**
     * Find orders by user ID
     * @param {number} userId - User ID
     * @returns {Promise<Array>} Array of orders
     */
    static async findByUserId(userId) {
        return await DatabaseManager.findEntries('Order', { userId }, { orderBy: 'orderDate DESC' });
    }

    /**
     * Find order with items and album details
     * @param {number} orderId - Order ID
     * @returns {Promise<Object|null>} Order with items or null
     */
    static async findWithItems(orderId) {
        const sql = `
            SELECT 
                o.orderId,
                o.userId,
                o.orderDate,
                oi.orderItemId,
                oi.albumId,
                oi.quantity,
                a.title as albumTitle,
                a.price as albumPrice,
                ar.name as artistName
            FROM \`Order\` o
            LEFT JOIN OrderItem oi ON o.orderId = oi.orderId
            LEFT JOIN Album a ON oi.albumId = a.albumId
            LEFT JOIN Artist ar ON a.artistId = ar.artistId
            WHERE o.orderId = ?
        `;
        
        const results = await DatabaseManager.query(sql, [orderId]);
        
        if (results.length === 0) return null;
        
        // Group order items
        const order = {
            orderId: results[0].orderId,
            userId: results[0].userId,
            orderDate: results[0].orderDate,
            items: []
        };
        
        results.forEach(row => {
            if (row.orderItemId) {
                order.items.push({
                    orderItemId: row.orderItemId,
                    albumId: row.albumId,
                    quantity: row.quantity,
                    album: {
                        title: row.albumTitle,
                        price: row.albumPrice,
                        artistName: row.artistName
                    }
                });
            }
        });
        
        return order;
    }

    /**
     * Find orders with items by user ID
     * @param {number} userId - User ID
     * @returns {Promise<Array>} Array of orders with items
     */
    static async findByUserIdWithItems(userId) {
        const sql = `
            SELECT 
                o.orderId,
                o.userId,
                o.orderDate,
                oi.orderItemId,
                oi.albumId,
                oi.quantity,
                a.title as albumTitle,
                a.price as albumPrice,
                ar.name as artistName
            FROM \`Order\` o
            LEFT JOIN OrderItem oi ON o.orderId = oi.orderId
            LEFT JOIN Album a ON oi.albumId = a.albumId
            LEFT JOIN Artist ar ON a.artistId = ar.artistId
            WHERE o.userId = ?
            ORDER BY o.orderDate DESC
        `;
        
        const results = await DatabaseManager.query(sql, [userId]);
        
        // Group by order
        const ordersMap = new Map();
        
        results.forEach(row => {
            if (!ordersMap.has(row.orderId)) {
                ordersMap.set(row.orderId, {
                    orderId: row.orderId,
                    userId: row.userId,
                    orderDate: row.orderDate,
                    items: []
                });
            }
            
            if (row.orderItemId) {
                ordersMap.get(row.orderId).items.push({
                    orderItemId: row.orderItemId,
                    albumId: row.albumId,
                    quantity: row.quantity,
                    album: {
                        title: row.albumTitle,
                        price: row.albumPrice,
                        artistName: row.artistName
                    }
                });
            }
        });
        
        return Array.from(ordersMap.values());
    }

    /**
     * Delete an order and its items
     * @param {number} orderId - Order ID
     * @returns {Promise<Object>} Deletion result
     */
    static async deleteOne(orderId) {
        // First delete all order items
        await DatabaseManager.deleteEntry('OrderItem', { orderId });
        // Then delete the order
        return await DatabaseManager.deleteEntry('Order', { orderId });
    }
}

module.exports = Order;
