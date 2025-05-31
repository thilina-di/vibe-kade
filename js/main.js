// Constants
const API_BASE_URL = 'http://localhost:3000/api';
const ASSETS_BASE_URL = 'http://localhost:3000';
const ENDPOINTS = {
    products: `${API_BASE_URL}/products`,
    login: `${API_BASE_URL}/auth/login`,
    register: `${API_BASE_URL}/auth/register`,
    cart: `${API_BASE_URL}/cart`,
};

// DOM Elements
const productsGrid = document.getElementById('productsGrid');
const cartCount = document.getElementById('cartCount');
const loginLink = document.getElementById('loginLink');
const categoryChips = document.querySelectorAll('.chip');
const priceSort = document.getElementById('priceSort');

// State
let products = [];
let filteredProducts = [];
let currentCategory = 'all';
let currentSort = '';

// Check authentication status on page load
document.addEventListener('DOMContentLoaded', () => {
    checkAuthStatus();
    loadProducts();
    setupEventListeners();
});

// Authentication Functions
function checkAuthStatus() {
    const token = localStorage.getItem('token');
    if (token) {
        const user = JSON.parse(localStorage.getItem('user'));
        loginLink.textContent = `Welcome, ${user.email}`;
        loginLink.href = '#';
        loginLink.addEventListener('click', logout);
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

// Product Functions
async function loadProducts() {
    try {
        showLoading();
        const response = await fetch(ENDPOINTS.products);
        if (!response.ok) throw new Error('Failed to fetch products');
        products = await response.json();
        filteredProducts = [...products];
        applyFilters();
    } catch (error) {
        console.error('Error loading products:', error);
        showError('Failed to load products. Please try again later.');
    } finally {
        hideLoading();
    }
}

function renderProducts(productsToRender) {
    if (!productsGrid) return;
    
    productsGrid.innerHTML = productsToRender.map(product => `
        <div class="product-card">
            <img src="${ASSETS_BASE_URL}/${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p class="price">LKR ${product.price.toLocaleString()}</p>
            <p class="description">${product.description}</p>
            <button onclick="addToCart(${product.id})" class="add-to-cart">
                Add to Cart
            </button>
        </div>
    `).join('');
}

// Filter and Sort Functions
function applyFilters() {
    let filtered = [...products];
    
    // Apply category filter
    if (currentCategory !== 'all') {
        filtered = filtered.filter(product => 
            product.brand.toLowerCase() === currentCategory.toLowerCase()
        );
    }
    
    // Apply price sort
    if (currentSort === 'low-to-high') {
        filtered.sort((a, b) => a.price - b.price);
    } else if (currentSort === 'high-to-low') {
        filtered.sort((a, b) => b.price - a.price);
    }
    
    filteredProducts = filtered;
    renderProducts(filteredProducts);
}

// Cart Functions
async function addToCart(productId) {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch(ENDPOINTS.cart, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ productId, quantity: 1 })
        });

        if (!response.ok) throw new Error('Failed to add to cart');
        
        updateCartCount();
        showSuccess('Product added to cart!');
    } catch (error) {
        console.error('Error adding to cart:', error);
        showError('Failed to add product to cart. Please try again.');
    }
}

async function updateCartCount() {
    const token = localStorage.getItem('token');
    if (!token || !cartCount) return;

    try {
        const response = await fetch(ENDPOINTS.cart, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error('Failed to fetch cart');
        
        const cart = await response.json();
        cartCount.textContent = cart.items.reduce((total, item) => total + item.quantity, 0);
    } catch (error) {
        console.error('Error updating cart count:', error);
    }
}

// UI Helper Functions
function showLoading() {
    if (productsGrid) {
        productsGrid.innerHTML = '<div class="loading">Loading products...</div>';
    }
}

function hideLoading() {
    const loading = document.querySelector('.loading');
    if (loading) {
        loading.remove();
    }
}

function showError(message) {
    // You can implement a more sophisticated error display
    alert(message);
}

function showSuccess(message) {
    // You can implement a more sophisticated success message display
    alert(message);
}

// Event Listeners Setup
function setupEventListeners() {
    // Category filter listeners
    categoryChips.forEach(chip => {
        chip.addEventListener('click', () => {
            categoryChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            currentCategory = chip.dataset.category;
            applyFilters();
        });
    });

    // Price sort listener
    if (priceSort) {
        priceSort.addEventListener('change', (e) => {
            currentSort = e.target.value;
            applyFilters();
        });
    }
}

// Initialize cart count on page load
updateCartCount(); 