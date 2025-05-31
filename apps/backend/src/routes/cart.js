const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { products } = require('../data/products');
const { carts } = require('../data/carts');

// Get cart - accessible by both guests and authenticated users
router.get('/', (req, res) => {
  try {
    // For authenticated users, get their cart from the database
    if (req.user) {
      const userCart = carts.find(cart => cart.userId === req.user.id) || { items: [] };
      return res.json({ items: userCart.items });
    }
    
    // For guests, return empty cart (they'll use localStorage)
    return res.json({ items: [] });
  } catch (error) {
    console.error('Error getting cart:', error);
    res.status(500).json({ message: 'Error getting cart' });
  }
});

// Add item to cart - accessible by both guests and authenticated users
router.post('/', (req, res) => {
  try {
    const { productId, quantity } = req.body;
    
    if (!productId || quantity < 1) {
      return res.status(400).json({ message: 'Invalid request' });
    }

    const product = products.find(p => p.id === productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // For authenticated users, update their cart in the database
    if (req.user) {
      let userCart = carts.find(cart => cart.userId === req.user.id);
      
      if (!userCart) {
        userCart = { userId: req.user.id, items: [] };
        carts.push(userCart);
      }

      const existingItem = userCart.items.find(item => item.productId === productId);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        userCart.items.push({
          productId,
          name: product.name,
          price: product.price,
          quantity,
          image: product.image
        });
      }

      return res.json({ items: userCart.items });
    }
    
    // For guests, return the product info (they'll handle cart in localStorage)
    return res.json({
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image
      }
    });
  } catch (error) {
    console.error('Error adding item to cart:', error);
    res.status(500).json({ message: 'Error adding item to cart' });
  }
});

// Update cart item - accessible by both guests and authenticated users
router.put('/:productId', (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!productId || quantity < 1) {
      return res.status(400).json({ message: 'Invalid request' });
    }

    // For authenticated users, update their cart in the database
    if (req.user) {
      const userCart = carts.find(cart => cart.userId === req.user.id);
      if (!userCart) {
        return res.status(404).json({ message: 'Cart not found' });
      }

      const item = userCart.items.find(item => item.productId === parseInt(productId));
      if (!item) {
        return res.status(404).json({ message: 'Item not found in cart' });
      }

      item.quantity = quantity;
      return res.json({ items: userCart.items });
    }
    
    // For guests, return success (they'll handle cart in localStorage)
    return res.json({ success: true });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ message: 'Error updating cart' });
  }
});

// Remove item from cart - accessible by both guests and authenticated users
router.delete('/:productId', (req, res) => {
  try {
    const { productId } = req.params;

    // For authenticated users, update their cart in the database
    if (req.user) {
      const userCart = carts.find(cart => cart.userId === req.user.id);
      if (!userCart) {
        return res.status(404).json({ message: 'Cart not found' });
      }

      userCart.items = userCart.items.filter(item => item.productId !== parseInt(productId));
      return res.json({ items: userCart.items });
    }
    
    // For guests, return success (they'll handle cart in localStorage)
    return res.json({ success: true });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    res.status(500).json({ message: 'Error removing item from cart' });
  }
});

// Clear cart - accessible by both guests and authenticated users
router.delete('/', (req, res) => {
  try {
    // For authenticated users, clear their cart in the database
    if (req.user) {
      const userCart = carts.find(cart => cart.userId === req.user.id);
      if (userCart) {
        userCart.items = [];
      }
    }
    
    // For both guests and authenticated users, return success
    return res.json({ success: true });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ message: 'Error clearing cart' });
  }
});

module.exports = router; 