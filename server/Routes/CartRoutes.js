const express = require("express");
const router = express.Router();

const {addToCart, getCart, removeFromCart} = require('../Controllers/CartController')


router.post('/add-to-cart/:productId/:userId', addToCart);

router.get('/cart', getCart);

router.delete('/remove-from-cart/:productId', removeFromCart);

module.exports = router