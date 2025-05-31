const { carts } = require('../data/carts');
const { products } = require('../data/products');

// Helper function to format cart items with product details
const formatCartItems = (items) => {
    return items.map(item => {
        const product = products.find(p => p.id === parseInt(item.productId));
        return {
            productId: item.productId.toString(),
            quantity: item.quantity,
            price: item.price,
            name: product?.name || 'Unknown Product',
            image: product?.image || ''
        };
    });
};

// Get cart
const getCart = (req, res) => {
    try {
        const userId = req.user.id;
        const cart = carts.find(c => c.userId === userId) || { userId, items: [] };
        res.json({
            items: formatCartItems(cart.items)
        });
    } catch (error) {
        console.error('Error getting cart:', error);
        res.status(500).json({ message: 'Error fetching cart' });
    }
};

// Add to cart
const addToCart = (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, quantity = 1 } = req.body;

        // Validate product
        const product = products.find(p => p.id === parseInt(productId));
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Find or create cart
        let cart = carts.find(c => c.userId === userId);
        if (!cart) {
            cart = { userId, items: [] };
            carts.push(cart);
        }

        // Check if product already in cart
        const existingItem = cart.items.find(item => item.productId === parseInt(productId));
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({
                productId: parseInt(productId),
                quantity,
                price: product.price
            });
        }

        res.json({
            items: formatCartItems(cart.items)
        });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ message: 'Error adding to cart' });
    }
};

// Update cart item
const updateCartItem = (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const { quantity } = req.body;

        const cart = carts.find(c => c.userId === userId);
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const item = cart.items.find(item => item.productId === parseInt(id));
        if (!item) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        if (quantity > 0) {
            item.quantity = quantity;
        } else {
            cart.items = cart.items.filter(item => item.productId !== parseInt(id));
        }

        res.json({
            items: formatCartItems(cart.items)
        });
    } catch (error) {
        console.error('Error updating cart:', error);
        res.status(500).json({ message: 'Error updating cart' });
    }
};

// Remove from cart
const removeFromCart = (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const cart = carts.find(c => c.userId === userId);
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = cart.items.filter(item => item.productId !== parseInt(id));
        res.json({
            items: formatCartItems(cart.items)
        });
    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).json({ message: 'Error removing from cart' });
    }
};

module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart
}; 