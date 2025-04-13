const express = require("express");
const router = express.Router();

const {addToCart, getCart, removeFromCart, removeItemFromCart} = require('../Controllers/CartController')


router.post('/add-to-cart/:productId/:userId', addToCart);

router.get('/cart/:userId', getCart);

router.delete('/remove-from-cart/:productId/:userId', removeFromCart);

router.delete('/remove-all-from-cart/:productId/:userId', removeItemFromCart);

module.exports = router