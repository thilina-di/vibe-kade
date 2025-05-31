# vibe-කඩේ (Vibe-Kade)

A modern e-commerce platform for mobile phones, built with React and Express.js.

## Features

### Customer Features
- Browse and search mobile phones by brand and price range
- View detailed product information
- Add products to shopping cart
- Persistent shopping cart using Context API and localStorage
- Secure checkout process
- Order tracking
- User account management
- Dark/Light theme support

### Admin Features
- Comprehensive admin dashboard
- Real-time statistics and analytics
- Product management (CRUD operations)
- Order management with status updates
- User management
- Revenue tracking

## Tech Stack

### Frontend
- React 18
- TypeScript
- Emotion (Styled Components)
- React Router
- Context API for state management
- Modern CSS features (Grid, Flexbox)
- Font Awesome icons
- Responsive design

### Backend
- Node.js
- Express.js
- In-memory data storage
- RESTful API architecture

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/vibe-kade.git
cd vibe-kade
```

2. Install dependencies:
```bash
cd apps/web
npm install
cd ../backend
npm install
```

3. Start the backend server:
```bash
cd apps/backend
npm start
```

4. Start the frontend server:
```bash
cd apps/web
npm start
```

5. Access the application:
- Frontend: http://localhost:3001
- Backend API: http://localhost:3000

### Default Admin Credentials
- Username: admin
- Password: admin123

## Project Structure

```
vibe-kade/
├── apps/
│   ├── web/
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── contexts/
│   │   │   ├── hooks/
│   │   │   ├── pages/
│   │   │   ├── styles/
│   │   │   └── utils/
│   │   ├── public/
│   │   └── package.json
│   └── backend/
│       ├── src/
│       │   ├── routes/
│       │   ├── controllers/
│       │   └── data/
│       └── package.json
└── documentation/
    ├── architecture.md
    ├── requirements.md
    └── CHECKLIST.md
```

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Orders
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create order
- `PUT /api/orders/:id` - Update order status (admin)
- `DELETE /api/orders/:id` - Delete order (admin)

### Users
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/users` - Get users (admin)
- `PUT /api/users/:id` - Update user (admin)
- `DELETE /api/users/:id` - Delete user (admin)

### Admin
- `GET /api/admin/stats` - Get dashboard statistics
- `GET /api/admin/products` - Get all products
- `GET /api/admin/orders` - Get all orders
- `GET /api/admin/users` - Get all users

## Security Features

- Role-based access control (RBAC)
- JWT authentication
- Password hashing
- Protected admin routes
- Input validation
- XSS protection
- CORS configuration

## UI Features

- Modern, clean design
- Responsive layout
- Interactive product cards
- Dynamic shopping cart with slide-in panel
- Form validation
- Loading states
- Error handling
- Success notifications
- Mobile-first approach
- Dark/Light theme support

## Color Scheme

- Primary: #0071e3
- Secondary: #f5f5f7
- Text (Light): #1d1d1f
- Text (Dark): #f5f5f7
- Border (Light): #d2d2d7
- Border (Dark): #3d3d3d
- Success: #28a745
- Danger: #dc3545
- Warning: #ffc107

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Design inspired by modern e-commerce platforms
- Icons provided by Font Awesome
- Sri Lankan provinces data for shipping
