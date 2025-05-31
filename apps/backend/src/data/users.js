const bcrypt = require('bcryptjs');

// Pre-hashed passwords for demo accounts
const users = [
    {
        id: 1,
        email: 'admin@vibekade.lk',
        // admin123
        password: '$2a$10$HRvB.KNHdSUDZHKiI5S/K.yD6AWiOFOPxNK/8NNUgSh0.vIUChZXq',
        name: 'Admin User',
        role: 'admin'
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