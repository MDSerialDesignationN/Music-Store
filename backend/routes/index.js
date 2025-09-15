var express = require("express");
const { albumRouter } = require("../src/entities/album");
const { artistRouter } = require("../src/entities/artist");
const { cartRouter } = require("../src/entities/cart");
const { orderRouter } = require("../src/entities/order");
const { trackRouter } = require("../src/entities/track");
const { userRouter } = require("../src/entities/user");
const { seedingRouter } = require("../src/entities/seeding");
const { authRouter } = require("../src/entities/auth");

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
