const { orders } = require('../data/orders');
const { carts } = require('../data/carts');

// Get orders
const getOrders = (req, res) => {
    try {
        const { id, role } = req.user;
        
        // If admin, return all orders
        // If customer, return only their orders
        const userOrders = role === 'admin' 
            ? orders 
            : orders.filter(order => order.userId === id);
            
        res.json(userOrders);
    } catch (error) {
        console.error('Error getting orders:', error);
        res.status(500).json({ message: 'Error fetching orders' });
    }
};

// Create order
const createOrder = (req, res) => {
    try {
        const userId = req.user.id;
        const { customerInfo, items, subtotal, shipping, total } = req.body;

        if (!customerInfo || !items || !subtotal || !shipping || !total) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const newOrder = {
            id: orders.length + 1,
            userId,
            customerInfo,
            items,
            subtotal,
            shipping,
            total,
            status: 'Pending',
            date: new Date().toISOString()
        };

        orders.push(newOrder);

        // Clear user's cart after order is created
        const cartIndex = carts.findIndex(c => c.userId === userId);
        if (cartIndex !== -1) {
            carts[cartIndex].items = [];
        }

        res.status(201).json(newOrder);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Error creating order' });
    }
};

// Update order status
const updateOrderStatus = (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['Pending', 'Processing', 'Completed', 'Cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const order = orders.find(o => o.id === parseInt(id));
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.status = status;
        res.json(order);
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ message: 'Error updating order' });
    }
};

module.exports = {
    getOrders,
    createOrder,
    updateOrderStatus
}; 