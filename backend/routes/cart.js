const express = require("express");
const DatabaseManager = require("../database/DatabaseManager");
const Album = require("../database/models/album");
const Cart = require("../database/models/Cart");
const { requireAuth } = require("../middleware/auth");

const cartRouter = express.Router();

cartRouter.get("/", requireAuth, async (req, res) => {
  const ownerId = req.session.userId;
  const cart = await DatabaseManager.findEntries(Cart, { owner: ownerId });
  if (!cart || cart.length === 0) {
    return res.status(404).json({ error: "Cart not found for this user" });
  }

  // Populate the cart with album and artist data
  await cart[0].populate({
    path: "items.album",
    populate: {
      path: "artist_id genre_id",
      select: "name country",
    },
  });

  // Transform the cart items to have cleaner field names
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
});

cartRouter.post("/", requireAuth, async (req, res) => {
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
});

cartRouter.put("/add", requireAuth, async (req, res) => {
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
});

cartRouter.put("/remove", requireAuth, async (req, res) => {
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
});

module.exports = cartRouter;
