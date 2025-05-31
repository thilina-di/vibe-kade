const express = require('express');
const router = express.Router();
const { isAdmin } = require('../middleware/auth');
const {
    getAllProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/products');

router.get('/', getAllProducts);
router.get('/:id', getProduct);
router.post('/', isAdmin, createProduct);
router.put('/:id', isAdmin, updateProduct);
router.delete('/:id', isAdmin, deleteProduct);

module.exports = router; 