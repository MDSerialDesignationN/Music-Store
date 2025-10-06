const DatabaseManager = require('../../../database/DatabaseManager');

/**
 * Cart Model
 * 
 * Defines the shopping cart data structure and operations for users.
 * Each user has one cart that contains multiple album items with quantities.
 * Uses separate Cart and CartItem tables following MySQL schema.
 * 
 * Features:
 * - CRUD operations for carts and cart items
 * - User ownership through foreign key reference
 * - Cart items with album references and quantities
 * - MySQL-based data persistence
 * - Support for populated album data
 */
class Cart {
    /**
     * Create a new cart for a user
     * @param {number} userId - User ID
     * @returns {Promise<Object>} Created cart with ID
     */
    static async create(userId) {
        return await DatabaseManager.createEntry('Cart', { userId });
    }

    /**
     * Find cart by user ID
     * @param {number} userId - User ID
     * @returns {Promise<Object|null>} Cart or null
     */
    static async findByUserId(userId) {
        const results = await DatabaseManager.findEntries('Cart', { userId });
        return results.length > 0 ? results[0] : null;
    }

    /**
     * Find cart with items and album details
     * @param {number} userId - User ID
     * @returns {Promise<Object|null>} Cart with items or null
     */
    static async findWithItems(userId) {
        const sql = `
            SELECT 
                c.cartId,
                c.userId,
                ci.cartItemId,
                ci.albumId,
                ci.quantity,
                a.title as albumTitle,
                a.price as albumPrice,
                ar.name as artistName
            FROM Cart c
            LEFT JOIN CartItem ci ON c.cartId = ci.cartId
            LEFT JOIN Album a ON ci.albumId = a.albumId
            LEFT JOIN Artist ar ON a.artistId = ar.artistId
            WHERE c.userId = ?
        `;
        
        const results = await DatabaseManager.query(sql, [userId]);
        
        if (results.length === 0) return null;
        
        // Group cart items
        const cart = {
            cartId: results[0].cartId,
            userId: results[0].userId,
            items: []
        };
        
        results.forEach(row => {
            if (row.cartItemId) {
                cart.items.push({
                    cartItemId: row.cartItemId,
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
        
        return cart;
    }

    /**
     * Add item to cart
     * @param {number} cartId - Cart ID
     * @param {number} albumId - Album ID
     * @param {number} quantity - Quantity
     * @returns {Promise<Object>} Created cart item
     */
    static async addItem(cartId, albumId, quantity = 1) {
        return await DatabaseManager.createEntry('CartItem', {
            cartId,
            albumId,
            quantity
        });
    }

    /**
     * Update cart item quantity
     * @param {number} cartItemId - Cart item ID
     * @param {number} quantity - New quantity
     * @returns {Promise<Object>} Update result
     */
    static async updateItemQuantity(cartItemId, quantity) {
        return await DatabaseManager.updateEntry('CartItem', { cartItemId }, { quantity });
    }

    /**
     * Remove item from cart
     * @param {number} cartItemId - Cart item ID
     * @returns {Promise<Object>} Deletion result
     */
    static async removeItem(cartItemId) {
        return await DatabaseManager.deleteEntry('CartItem', { cartItemId });
    }

    /**
     * Clear all items from cart
     * @param {number} cartId - Cart ID
     * @returns {Promise<Object>} Deletion result
     */
    static async clearItems(cartId) {
        return await DatabaseManager.deleteEntry('CartItem', { cartId });
    }

    /**
     * Delete a cart
     * @param {number} cartId - Cart ID
     * @returns {Promise<Object>} Deletion result
     */
    static async deleteOne(cartId) {
        // First delete all cart items
        await this.clearItems(cartId);
        // Then delete the cart
        return await DatabaseManager.deleteEntry('Cart', { cartId });
    }
}

module.exports = Cart;
