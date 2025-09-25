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
     * Populates cart items with album information including artist and genre data.
     * 
     * @param {Object} req - Express request object with user session
     * @param {Object} res - Express response object
     * @returns {Object} JSON response with populated cart data
     */
    static async getUserCart(req, res) {
        const ownerId = req.session.userId;
        const cart = await DatabaseManager.findEntries(Cart, { owner: ownerId });
        
        if (!cart || cart.length === 0) {
            return res.status(404).json({ error: "Cart not found for this user" });
        }

        // Populate the cart with complete album and artist data
        await cart[0].populate({
            path: "items.album",
            populate: {
                path: "artist_id genre_id",
                select: "name country",
            },
        });

        // Transform the cart items to have cleaner, more readable field names
        const transformedCart = {
            ...cart[0].toObject(),
            items: cart[0].items.map((item) => ({
                album: {
                    _id: item.album._id,
                    title: item.album.title,
                    release_year: item.album.release_year,
                    price: item.album.price,
                    artist: item.album.artist_id,
                    genre: item.album.genre_id,
                },
                quantity: item.quantity,
            })),
        };

        res.json({
            message: "Cart retrieved successfully",
            cart: transformedCart,
        });
    }

    static async createCart(req, res) {
        const ownerId = req.session.userId;
        const existingCart = await DatabaseManager.findEntries(Cart, {
            owner: ownerId,
        });
        if (existingCart && existingCart.length > 0) {
            return res.status(400).json({ error: "Cart already exists for this user" });
        }
        const cart = await DatabaseManager.createEntry(Cart, {
            owner: ownerId,
            items: [],
        });
        res.status(201).json({
            message: "Cart created successfully",
            cart: cart,
        });
    }

    static async addItemToCart(req, res) {
        const ownerId = req.session.userId;
        const { albumId, quantity } = req.body;
        if (!albumId || !quantity || quantity <= 0) {
            return res
                .status(400)
                .json({ error: "albumId and positive quantity are required" });
        }
        const album = await DatabaseManager.findEntries(Album, { _id: albumId });
        if (!album || album.length === 0) {
            return res.status(404).json({ error: "Album not found" });
        }
        const cart = await DatabaseManager.findEntries(Cart, { owner: ownerId });
        if (!cart || cart.length === 0) {
            return res.status(404).json({ error: "Cart not found for this user" });
        }
        const userCart = cart[0];
        const existingItemIndex = userCart.items.findIndex(
            (item) => item.album.toString() === albumId
        );
        if (existingItemIndex >= 0) {
            userCart.items[existingItemIndex].quantity += quantity;
        } else {
            userCart.items.push({ album: albumId, quantity: quantity });
        }
        await userCart.save();

        // Populate the cart with album and artist data before returning
        await userCart.populate({
            path: "items.album",
            populate: {
                path: "artist_id genre_id",
                select: "name country",
            },
        });

        // Transform the cart items to have cleaner field names
        const transformedCart = {
            ...userCart.toObject(),
            items: userCart.items.map((item) => ({
                album: {
                    _id: item.album._id,
                    title: item.album.title,
                    release_year: item.album.release_year,
                    price: item.album.price,
                    artist: item.album.artist_id,
                    genre: item.album.genre_id,
                },
                quantity: item.quantity,
            })),
        };

        res.json({
            message: "Item added to cart successfully",
            cart: transformedCart,
        });
    }

    static async removeItemFromCart(req, res) {
        const ownerId = req.session.userId;
        const { albumId, quantity } = req.body;
        if (!albumId || !quantity || quantity <= 0) {
            return res
                .status(400)
                .json({ error: "albumId and positive quantity are required" });
        }
        const album = await DatabaseManager.findEntries(Album, { _id: albumId });
        if (!album || album.length === 0) {
            return res.status(404).json({ error: "Album not found" });
        }
        const cart = await DatabaseManager.findEntries(Cart, { owner: ownerId });
        if (!cart || cart.length === 0) {
            return res.status(404).json({ error: "Cart not found for this user" });
        }
        const userCart = cart[0];
        const existingItemIndex = userCart.items.findIndex(
            (item) => item.album.toString() === albumId
        );
        if (existingItemIndex === -1) {
            return res.status(400).json({ error: "Album not in cart" });
        }

        if (userCart.items[existingItemIndex].quantity > quantity) {
            userCart.items[existingItemIndex].quantity -= quantity;
        } else {
            userCart.items.splice(existingItemIndex, 1);
        }
        await userCart.save();

        // Populate the cart with album and artist data before returning
        await userCart.populate({
            path: "items.album",
            populate: {
                path: "artist_id genre_id",
                select: "name country",
            },
        });

        // Transform the cart items to have cleaner field names
        const transformedCart = {
            ...userCart.toObject(),
            items: userCart.items.map((item) => ({
                album: {
                    _id: item.album._id,
                    title: item.album.title,
                    release_year: item.album.release_year,
                    price: item.album.price,
                    artist: item.album.artist_id,
                    genre: item.album.genre_id,
                },
                quantity: item.quantity,
            })),
        };

        res.json({
            message: "Item removed from cart successfully",
            cart: transformedCart,
        });
    }
}

module.exports = CartController;
