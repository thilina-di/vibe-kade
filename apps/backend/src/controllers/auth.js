const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { users } = require('../data/users');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Login controller
const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log('Login attempt:', { username });

        // Find user
        const user = users.find(u => u.username === username);
        if (!user) {
            console.log('User not found:', username);
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        console.log('User found:', { username: user.username, role: user.role });

        // For the default admin account with unhashed password
        let isValidPassword = false;
        if (user.role === 'admin' && !user.password.startsWith('$2')) {
            isValidPassword = password === user.password;
        } else {
            isValidPassword = await bcrypt.compare(password, user.password);
        }
        console.log('Password check:', { isValid: isValidPassword });

        if (!isValidPassword) {
            console.log('Invalid password for user:', username);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        console.log('Login successful:', { username: user.username, role: user.role });

        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Error during login' });
    }
};

// Register controller
const register = async (req, res) => {
    try {
        const { email, password, name } = req.body;

        // Check if user exists
        if (users.some(u => u.email === email)) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = {
            id: users.length + 1,
            email,
            password: hashedPassword,
            name,
            role: 'customer'
        };

        users.push(newUser);

        // Generate token
        const token = jwt.sign(
            { id: newUser.id, email: newUser.email, role: newUser.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            token,
            user: {
                id: newUser.id,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Error during registration' });
    }
};

module.exports = {
    login,
    register
}; 