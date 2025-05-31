const express = require('express');
const router = express.Router();
const { isAuth } = require('../middleware/auth');
const {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart
} = require('../controllers/cart');

router.get('/', isAuth, getCart);
router.post('/', isAuth, addToCart);
router.put('/:id', isAuth, updateCartItem);
router.delete('/:id', isAuth, removeFromCart);

module.exports = router; 