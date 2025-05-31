# SmartCart Requirements

## Overview
SmartCart is a simplified e-commerce web application built with vanilla JavaScript on the frontend and Express.js on the backend, using in-memory data storage.

## Technology Stack
- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Backend**: Node.js with Express
- **Storage**: In-memory data structure / JSON

## Core Features

### 1. User Access and Role-based Experience
- Two roles:
  - Customer: Browse, add to cart, place orders
  - Administrator: Manage products, view/fulfill orders
- Simple authentication using username/password
- Role-based access control

### 2. Product Discovery and Browsing
- Home page with product display:
  - Name
  - Price
  - Image
- Search functionality
- Filter and sort by:
  - Category
  - Price (low to high / high to low)

### 3. Shopping Cart Management
- Add products to cart
  - Sliding cart panel appears from left
  - Shows recently added item details
  - Option to view full cart
- View cart page
- Change quantity
- Remove items
- View order total

### 4. Checkout Process
- Checkout page with:
  - Order summary
  - Customer details form
  - Simple delivery cost calculation
  - Order confirmation message

### 5. Admin Dashboard
- Protected admin access
- Product management:
  - Add/edit/delete products
  - Set availability status
- Order management:
  - View orders
  - Update order status

## Optional Enhancements
Choose 1-2 from:
- Save favorite products
- Theme toggle (Light/Dark)
- Persistent cart (localStorage)
- Language selector
- Order confirmation animation