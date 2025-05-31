// Constants
const API_BASE_URL = 'http://localhost:3000/api';
const ENDPOINTS = {
    cart: `${API_BASE_URL}/cart`,
    orders: `${API_BASE_URL}/orders`,
};

// DOM Elements
const cartItems = document.getElementById('cartItems');
const subtotalElement = document.getElementById('subtotal');
const shippingElement = document.getElementById('shipping');
const totalElement = document.getElementById('total');
const checkoutButton = document.getElementById('checkoutButton');

// State
let cart = {
    items: [],
    subtotal: 0,
    shipping: 0,
    total: 0
};

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    setupEventListeners();
});

function setupEventListeners() {
    if (checkoutButton) {
        checkoutButton.addEventListener('click', handleCheckout);
    }
}

// Cart Functions
async function loadCart() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch(ENDPOINTS.cart, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error('Failed to fetch cart');
        
        cart = await response.json();
        renderCart();
        updateSummary();
    } catch (error) {
        console.error('Error loading cart:', error);
        showError('Failed to load cart. Please try again later.');
    }
}

async function updateQuantity(itemId, quantity) {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
        const response = await fetch(`${ENDPOINTS.cart}/${itemId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ quantity })
        });

        if (!response.ok) throw new Error('Failed to update quantity');
        
        loadCart(); // Reload cart to get updated totals
    } catch (error) {
        console.error('Error updating quantity:', error);
        showError('Failed to update quantity. Please try again.');
    }
}

async function removeItem(itemId) {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
        const response = await fetch(`${ENDPOINTS.cart}/${itemId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error('Failed to remove item');
        
        loadCart(); // Reload cart to get updated totals
    } catch (error) {
        console.error('Error removing item:', error);
        showError('Failed to remove item. Please try again.');
    }
}

// UI Functions
function renderCart() {
    if (!cartItems) return;

    if (!cart.items.length) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        checkoutButton.disabled = true;
        return;
    }

    cartItems.innerHTML = cart.items.map(item => `
        <div class="cart-item">
            <img src="http://localhost:3000/${item.image}" alt="${item.name}">
            <div class="item-details">
                <h3>${item.name}</h3>
                <p class="price">LKR ${item.price.toLocaleString()}</p>
            </div>
            <div class="quantity-controls">
                <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})" 
                        ${item.quantity <= 1 ? 'disabled' : ''}>-</button>
                <span>${item.quantity}</span>
                <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
            </div>
            <button class="remove-item" onclick="removeItem(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');

    checkoutButton.disabled = false;
}

function updateSummary() {
    if (!subtotalElement || !shippingElement || !totalElement) return;

    const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 0 ? 1000 : 0; // LKR 1000 flat rate shipping
    const total = subtotal + shipping;

    subtotalElement.textContent = `LKR ${subtotal.toLocaleString()}`;
    shippingElement.textContent = `LKR ${shipping.toLocaleString()}`;
    totalElement.textContent = `LKR ${total.toLocaleString()}`;
}

function handleCheckout() {
    // Save cart to localStorage for checkout page
    localStorage.setItem('checkout_cart', JSON.stringify(cart));
    window.location.href = 'checkout.html';
}

// Helper Functions
function showError(message) {
    // You can implement a more sophisticated error display
    alert(message);
} 