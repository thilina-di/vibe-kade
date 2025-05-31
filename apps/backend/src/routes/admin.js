const express = require('express');
const router = express.Router();

// In-memory data store
let products = [];
let orders = [];
let users = [
    {
        id: 1,
        username: 'admin',
        password: 'admin123', // In production, this should be hashed
        role: 'admin',
        joinDate: new Date()
    }
];

// Middleware to check admin authentication
const checkAdminAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'No authorization header' });
    }

    try {
        const token = authHeader.split(' ')[1];
        const user = JSON.parse(Buffer.from(token, 'base64').toString());
        
        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }
        
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

// Get dashboard stats
router.get('/stats', checkAdminAuth, (req, res) => {
    const stats = {
        totalOrders: orders.length,
        totalProducts: products.length,
        totalUsers: users.length,
        totalRevenue: orders.reduce((sum, order) => sum + order.total, 0)
    };
    res.json(stats);
});

// Product Management
router.get('/products', checkAdminAuth, (req, res) => {
    res.json(products);
});

router.post('/products', checkAdminAuth, (req, res) => {
    const { name, category, price, image } = req.body;
    const newProduct = {
        id: products.length + 1,
        name,
        category,
        price,
        image
    };
    products.push(newProduct);
    res.status(201).json(newProduct);
});

router.put('/products/:id', checkAdminAuth, (req, res) => {
    const { id } = req.params;
    const { name, category, price, image } = req.body;
    const index = products.findIndex(p => p.id === parseInt(id));
    
    if (index === -1) {
        return res.status(404).json({ message: 'Product not found' });
    }

    products[index] = {
        ...products[index],
        name,
        category,
        price,
        image
    };

    res.json(products[index]);
});

router.delete('/products/:id', checkAdminAuth, (req, res) => {
    const { id } = req.params;
    const index = products.findIndex(p => p.id === parseInt(id));
    
    if (index === -1) {
        return res.status(404).json({ message: 'Product not found' });
    }

    products.splice(index, 1);
    res.status(204).send();
});

// Order Management
router.get('/orders', checkAdminAuth, (req, res) => {
    res.json(orders);
});

router.put('/orders/:id', checkAdminAuth, (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const index = orders.findIndex(o => o.id === parseInt(id));
    
    if (index === -1) {
        return res.status(404).json({ message: 'Order not found' });
    }

    orders[index] = {
        ...orders[index],
        status
    };

    res.json(orders[index]);
});

// User Management
router.get('/users', checkAdminAuth, (req, res) => {
    // Don't send passwords in response
    const safeUsers = users.map(({ password, ...user }) => user);
    res.json(safeUsers);
});

router.post('/users', checkAdminAuth, (req, res) => {
    const { username, password, role } = req.body;
    
    if (users.some(u => u.username === username)) {
        return res.status(400).json({ message: 'Username already exists' });
    }

    const newUser = {
        id: users.length + 1,
        username,
        password, // In production, this should be hashed
        role: role || 'customer',
        joinDate: new Date()
    };

    users.push(newUser);
    const { password: _, ...safeUser } = newUser;
    res.status(201).json(safeUser);
});

router.put('/users/:id', checkAdminAuth, (req, res) => {
    const { id } = req.params;
    const { username, password, role } = req.body;
    const index = users.findIndex(u => u.id === parseInt(id));
    
    if (index === -1) {
        return res.status(404).json({ message: 'User not found' });
    }

    if (username && username !== users[index].username &&
        users.some(u => u.username === username)) {
        return res.status(400).json({ message: 'Username already exists' });
    }

    users[index] = {
        ...users[index],
        ...(username && { username }),
        ...(password && { password }), // In production, this should be hashed
        ...(role && { role })
    };

    const { password: _, ...safeUser } = users[index];
    res.json(safeUser);
});

router.delete('/users/:id', checkAdminAuth, (req, res) => {
    const { id } = req.params;
    const index = users.findIndex(u => u.id === parseInt(id));
    
    if (index === -1) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Prevent deleting the last admin
    if (users[index].role === 'admin' &&
        users.filter(u => u.role === 'admin').length === 1) {
        return res.status(400).json({ message: 'Cannot delete last admin user' });
    }

    users.splice(index, 1);
    res.status(204).send();
});

module.exports = router; 