const express = require('express');
const router = express.Router();
const { isAuth, isAdmin, auth } = require('../middleware/auth');
const {
    getOrders,
    createOrder,
    updateOrderStatus
} = require('../controllers/orders');
const { orders } = require('../data/orders');

// Get all orders (admin only)
router.get('/', auth, getOrders);

// Get user orders
router.get('/my-orders', auth, getOrders);

// Get single order
router.get('/:id', auth, (req, res) => {
    try {
        const { id } = req.params;
        const order = orders.find(o => o.id === parseInt(id));
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if user has access to this order
        const user = req.user;
        if (user.role !== 'admin' && order.userId !== user.id) {
            return res.status(403).json({ message: 'Not authorized to view this order' });
        }

        res.json(order);
    } catch (error) {
        console.error('Error getting order:', error);
        res.status(500).json({ message: 'Error fetching order' });
    }
});

// Create order (authenticated users)
router.post('/', auth, createOrder);

// Create guest order
router.post('/guest', (req, res) => {
    try {
        const { email, phone, name, address, city, items } = req.body;
        
        if (!email || !phone || !name || !address || !city || !items) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        
        const order = {
            id: orders.length + 1,
            guestInfo: {
                email,
                phone,
                name,
                address,
                city
            },
            items,
            status: 'pending',
            isGuest: true,
            createdAt: new Date().toISOString()
        };
        
        orders.push(order);
        res.status(201).json({ 
            orderId: order.id,
            message: 'Order placed successfully'
        });
    } catch (error) {
        console.error('Error creating guest order:', error);
        res.status(500).json({ message: 'Error creating order' });
    }
});

// Update order status (admin only)
router.put('/:id', auth, isAdmin, updateOrderStatus);

// Delete order (admin only)
router.delete('/:id', auth, isAdmin, (req, res) => {
    try {
        const { id } = req.params;
        const index = orders.findIndex(o => o.id === parseInt(id));
        
        if (index === -1) {
            return res.status(404).json({ message: 'Order not found' });
        }

        orders.splice(index, 1);
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ message: 'Error deleting order' });
    }
});

module.exports = router; 