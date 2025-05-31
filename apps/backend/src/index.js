require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable trust proxy
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "blob:"],
            styleSrc: ["'self'", "'unsafe-inline'", "https:"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https:"],
            fontSrc: ["'self'", "https:", "data:"],
            connectSrc: ["'self'"],
        },
    },
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false
}));

// CORS configuration
app.use(cors({
    origin: ['http://localhost:8000', 'http://localhost:3000', 'http://127.0.0.1:8000', 'http://127.0.0.1:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Serve static files from public directory
app.use('/assets', express.static(path.join(__dirname, '../public/assets')));

// Rate limiting
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 1000, // limit each IP to 1000 requests per minute
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests, please try again later.'
});

// Apply rate limiting only to API routes that need protection
app.use('/api/auth', limiter);
app.use('/api/cart', limiter);
app.use('/api/orders', limiter);
app.use('/api/admin', limiter);

// Body parsing middleware
app.use(express.json());

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// Health check route
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
}); 