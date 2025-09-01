var express = require('express');
const seedingRouter = require('./seeding');
const cartRouter = require('./cart');
const userRouter = require('./user');
const authRouter = require('./auth');
const orderRouter = require('./order');

const router = express.Router();


// router.use('/seeding', seedingRouter)
router.use('/cart', cartRouter)
router.use('/user', userRouter)
router.use('/auth', authRouter)
router.use('/order', orderRouter)

module.exports = router;