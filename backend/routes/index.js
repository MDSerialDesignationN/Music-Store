var express = require("express");
const seedingRouter = require("./seeding");
const cartRouter = require("./cart");
const userRouter = require("./user");
const authRouter = require("./auth");
const orderRouter = require("./order");
const albumRouter = require("./album");
const trackRouter = require("./track");
const artistRouter = require("./artist");

const router = express.Router();

router.use("/seeding", seedingRouter);
router.use("/cart", cartRouter);
router.use("/user", userRouter);
router.use("/auth", authRouter);
router.use("/order", orderRouter);
router.use("/album", albumRouter);
router.use("/track", trackRouter);
router.use("/artist", artistRouter);

module.exports = router;
