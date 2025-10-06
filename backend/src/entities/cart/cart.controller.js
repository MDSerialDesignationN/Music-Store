const DatabaseManager = require("../../../database/DatabaseManager");
const { Album } = require("../album");
const Cart = require("./cart.model");

/**
 * CartController Class
 * 
 * Handles HTTP requests related to shopping cart operations.
 * Manages cart creation, item addition/removal, quantity updates,
 * and cart retrieval with populated product information.
 * 
 * Features:
 * - User-specific cart management
 * - Album inventory validation
 * - Quantity management with bounds checking
 * - Populated cart data with album and artist information
 * - Cart clearing and total calculation
 */
class CartController {

    /**
     * Get User's Shopping Cart
     * 
     * Retrieves the authenticated user's shopping cart with full album details.
     * Includes album information with artist and genre data.
     * 
     * @param {Object} req - Express request object with user session
     * @param {Object} res - Express response object
     * @returns {Object} JSON response with populated cart data
     */
    static async getUserCart(req, res) {
        try {
            const userId = req.session.userId;
            const cart = await Cart.findWithItems(userId);
            
            if (!cart) {
                return res.status(404).json({ error: "Cart not found for this user" });
            }

            // Transform the cart items to have cleaner, more readable field names
            const transformedCart = {
                id: cart.cartId,
                owner: cart.userId,
                items: cart.items.map((item) => ({
                    id: item.cartItemId,
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
            };

            res.json({
                message: "Cart retrieved successfully",
                cart: transformedCart,
            });
        } catch (error) {
            console.error("Error retrieving cart:", error);
            res.status(500).json({
                error: "Internal Server Error while retrieving cart",
                details: error.message,
            });
        }
    }

    static async createCart(req, res) {
        try {
            const userId = req.session.userId;
            const existingCart = await Cart.findByUserId(userId);
            
            if (existingCart) {
                return res.status(400).json({ error: "Cart already exists for this user" });
            }
            
            const cartResult = await Cart.create(userId);
            res.status(201).json({
                message: "Cart created successfully",
                cart: { id: cartResult.insertId, userId: userId },
            });
        } catch (error) {
            console.error("Error creating cart:", error);
            res.status(500).json({
                error: "Internal Server Error while creating cart",
                details: error.message,
            });
        }
    }

    static async addItemToCart(req, res) {
        try {
            const userId = req.session.userId;
            const { albumId, quantity } = req.body;
            
            if (!albumId || !quantity || quantity <= 0) {
                return res.status(400).json({ 
                    error: "albumId and positive quantity are required" 
                });
            }

            // Validate album exists
            const album = await Album.findById(albumId);
            if (!album) {
                return res.status(404).json({ error: "Album not found" });
            }

            // Get or create cart
            let cart = await Cart.findWithItems(userId);
            if (!cart) {
                const cartResult = await Cart.create(userId);
                cart = await Cart.findWithItems(userId);
            }

            console.log(cart)

            // check if item already in cart. if so, update quantity instead
            const existingItem = cart.items.find(item => item.albumId === albumId);
            if (existingItem) {
                await Cart.updateItemQuantity(existingItem.cartItemId, existingItem.quantity + quantity);
            } else {
               await Cart.addItem(cart.cartId, albumId, quantity);
            }

            // Return updated cart
            const updatedCart = await Cart.findWithItems(userId);
            console.log("Updated cart after add:", updatedCart);
            
            if (!updatedCart) {
                return res.status(500).json({ error: "Failed to retrieve updated cart" });
            }

            const transformedCart = {
                id: updatedCart.cartId,
                owner: updatedCart.userId,
                items: updatedCart.items.map((item) => ({
                    id: item.cartItemId,
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
            };

            console.log("Transformed cart:", transformedCart);

            res.json({
                message: "Item added to cart successfully",
                cart: transformedCart,
            });
        } catch (error) {
            console.error("Error adding item to cart:", error);
            res.status(500).json({
                error: "Internal Server Error while adding item to cart",
                details: error.message,
            });
        }
    }

    static async updateCartItemQuantity(req, res) {
        try {
            const userId = req.session.userId;
            const { cartItemId, quantity } = req.body;

            if (!cartItemId || !quantity || quantity <= 0) {
                return res.status(400).json({ 
                    error: "cartItemId and positive quantity are required" 
                });
            }

            await Cart.updateItemQuantity(cartItemId, quantity);

            // Return updated cart
            const updatedCart = await Cart.findWithItems(userId);
            const transformedCart = {
                id: updatedCart.cartId,
                owner: updatedCart.userId,
                items: updatedCart.items.map((item) => ({
                    id: item.cartItemId,
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
            };

            res.json({
                message: "Cart item quantity updated successfully",
                cart: transformedCart,
            });
        } catch (error) {
            console.error("Error updating cart item quantity:", error);
            res.status(500).json({
                error: "Internal Server Error while updating cart item quantity",
                details: error.message,
            });
        }
    }

    static async removeItemFromCart(req, res) {
        try {
            const userId = req.session.userId;
            const { albumId, quantity } = req.body;

            if (!albumId) {
                return res.status(400).json({ 
                    error: "albumId is required" 
                });
            }

            // Get current cart
            const cart = await Cart.findWithItems(userId);
            if (!cart) {
                return res.status(404).json({ error: "Cart not found" });
            }

            // Find the cart item
            const cartItem = cart.items.find(item => item.albumId === albumId);
            if (!cartItem) {
                return res.status(404).json({ error: "Item not found in cart" });
            }

            // If quantity is provided and less than current quantity, reduce it
            if (quantity && quantity > 0 && cartItem.quantity > quantity) {
                const newQuantity = cartItem.quantity - quantity;
                await Cart.updateItemQuantity(cartItem.cartItemId, newQuantity);
            } else {
                // Remove item completely
                await Cart.removeItem(cartItem.cartItemId);
            }

            // Return updated cart
            const updatedCart = await Cart.findWithItems(userId);
            const transformedCart = {
                id: updatedCart.cartId,
                owner: updatedCart.userId,
                items: updatedCart.items.map((item) => ({
                    id: item.cartItemId,
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
            };

            res.json({
                message: "Item removed from cart successfully",
                cart: transformedCart,
            });
        } catch (error) {
            console.error("Error removing item from cart:", error);
            res.status(500).json({
                error: "Internal Server Error while removing item from cart",
                details: error.message,
            });
        }
    }

    static async clearCart(req, res) {
        try {
            const userId = req.session.userId;
            const cart = await Cart.findByUserId(userId);

            if (!cart) {
                return res.status(404).json({ error: "Cart not found" });
            }

            await Cart.clearItems(cart.cartId);

            res.json({
                message: "Cart cleared successfully",
                cart: {
                    id: cart.cartId,
                    owner: cart.userId,
                    items: []
                }
            });
        } catch (error) {
            console.error("Error clearing cart:", error);
            res.status(500).json({
                error: "Internal Server Error while clearing cart",
                details: error.message,
            });
        }
    }
}

module.exports = CartController;
