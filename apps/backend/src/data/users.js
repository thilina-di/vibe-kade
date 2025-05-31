const bcrypt = require('bcryptjs');

// Pre-hashed passwords for demo accounts
const users = [
    {
        id: 1,
        username: 'admin',
        password: 'admin123', // Default admin password (in production this should be hashed)
        role: 'admin',
        joinDate: new Date()
    },
    {
        id: 2,
        email: 'customer@vibekade.lk',
        // customer123
        password: '$2a$10$HRvB.KNHdSUDZHKiI5S/K.yD6AWiOFOPxNK/8NNUgSh0.vIUChZXq',
        name: 'Test Customer',
        role: 'customer'
    }
];

module.exports = {
    users
}; 