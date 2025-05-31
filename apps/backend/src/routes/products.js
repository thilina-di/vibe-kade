const express = require('express');
const router = express.Router();
const { isAdmin, auth } = require('../middleware/auth');
const {
    getAllProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/products');

// Public routes
router.get('/', getAllProducts);
router.get('/:id', getProduct);

// Protected routes
router.post('/', auth, isAdmin, createProduct);
router.put('/:id', auth, isAdmin, updateProduct);
router.delete('/:id', auth, isAdmin, deleteProduct);

module.exports = router; 