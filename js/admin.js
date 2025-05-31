// Constants
const API_BASE_URL = 'http://localhost:3000/api';
const ENDPOINTS = {
    products: `${API_BASE_URL}/products`,
    orders: `${API_BASE_URL}/orders`,
};

// DOM Elements
const productsTab = document.getElementById('productsTab');
const ordersTab = document.getElementById('ordersTab');
const adminProductsGrid = document.getElementById('adminProductsGrid');
const ordersList = document.getElementById('ordersList');
const addProductBtn = document.getElementById('addProductBtn');
const productModal = document.getElementById('productModal');
const productForm = document.getElementById('productForm');
const modalTitle = document.getElementById('modalTitle');
const logoutLink = document.getElementById('logoutLink');

// State
let currentTab = 'products';
let editingProductId = null;

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    checkAdminAuth();
    setupEventListeners();
    loadProducts();
    loadOrders();
});

function setupEventListeners() {
    // Tab navigation
    document.querySelectorAll('.nav-links a[data-tab]').forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            switchTab(e.target.dataset.tab);
        });
    });

    // Product modal
    if (addProductBtn) {
        addProductBtn.addEventListener('click', () => openModal());
    }

    if (productModal) {
        productModal.querySelector('.close').addEventListener('click', closeModal);
    }

    if (productForm) {
        productForm.addEventListener('submit', handleProductSubmit);
    }

    if (logoutLink) {
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
}

// Auth Functions
function checkAdminAuth() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!token || user.role !== 'admin') {
        window.location.href = 'login.html';
    }
}

// Tab Functions
function switchTab(tab) {
    currentTab = tab;
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.remove('active');
    });
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
    });

    document.getElementById(`${tab}Tab`).classList.add('active');
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

    if (tab === 'products') {
        loadProducts();
    } else if (tab === 'orders') {
        loadOrders();
    }
}

// Product Functions
async function loadProducts() {
    if (!adminProductsGrid) return;

    try {
        const response = await fetch(ENDPOINTS.products);
        if (!response.ok) throw new Error('Failed to fetch products');
        
        const products = await response.json();
        renderProducts(products);
    } catch (error) {
        console.error('Error loading products:', error);
        showError('Failed to load products');
    }
}

function renderProducts(products) {
    if (!adminProductsGrid) return;

    adminProductsGrid.innerHTML = products.map(product => `
        <div class="product-card admin">
            <img src="http://localhost:3000/${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p class="price">LKR ${product.price.toLocaleString()}</p>
            <p class="description">${product.description || ''}</p>
            <div class="admin-actions">
                <button onclick="editProduct(${product.id})" class="edit-button">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button onclick="deleteProduct(${product.id})" class="delete-button">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `).join('');
}

async function handleProductSubmit(event) {
    event.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) return;

    const formData = new FormData(productForm);
    const productData = Object.fromEntries(formData.entries());

    try {
        const url = editingProductId 
            ? `${ENDPOINTS.products}/${editingProductId}`
            : ENDPOINTS.products;

        const method = editingProductId ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(productData)
        });

        if (!response.ok) throw new Error('Failed to save product');

        closeModal();
        loadProducts();
        showSuccess(`Product ${editingProductId ? 'updated' : 'added'} successfully`);
    } catch (error) {
        console.error('Error saving product:', error);
        showError('Failed to save product');
    }
}

async function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
        const response = await fetch(`${ENDPOINTS.products}/${productId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error('Failed to delete product');

        loadProducts();
        showSuccess('Product deleted successfully');
    } catch (error) {
        console.error('Error deleting product:', error);
        showError('Failed to delete product');
    }
}

async function editProduct(productId) {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
        const response = await fetch(`${ENDPOINTS.products}/${productId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error('Failed to fetch product');

        const product = await response.json();
        openModal(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        showError('Failed to load product details');
    }
}

// Order Functions
async function loadOrders() {
    if (!ordersList) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
        const response = await fetch(ENDPOINTS.orders, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error('Failed to fetch orders');

        const orders = await response.json();
        renderOrders(orders);
    } catch (error) {
        console.error('Error loading orders:', error);
        showError('Failed to load orders');
    }
}

function renderOrders(orders) {
    if (!ordersList) return;

    if (!orders.length) {
        ordersList.innerHTML = '<p class="no-orders">No orders found</p>';
        return;
    }

    ordersList.innerHTML = orders.map(order => `
        <div class="order-card">
            <div class="order-header">
                <h3>Order #${order.id}</h3>
                <span class="order-date">${new Date(order.date).toLocaleDateString()}</span>
            </div>
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item">
                        <span>${item.name}</span>
                        <span>x${item.quantity}</span>
                        <span>LKR ${item.price.toLocaleString()}</span>
                    </div>
                `).join('')}
            </div>
            <div class="order-footer">
                <div class="order-total">
                    <span>Total:</span>
                    <span>LKR ${order.total.toLocaleString()}</span>
                </div>
                <div class="order-status">
                    <select onchange="updateOrderStatus(${order.id}, this.value)">
                        <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                        <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>Processing</option>
                        <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Shipped</option>
                        <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                    </select>
                </div>
            </div>
        </div>
    `).join('');
}

async function updateOrderStatus(orderId, status) {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
        const response = await fetch(`${ENDPOINTS.orders}/${orderId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status })
        });

        if (!response.ok) throw new Error('Failed to update order status');

        showSuccess('Order status updated successfully');
    } catch (error) {
        console.error('Error updating order status:', error);
        showError('Failed to update order status');
    }
}

// Modal Functions
function openModal(product = null) {
    editingProductId = product ? product.id : null;
    modalTitle.textContent = product ? 'Edit Product' : 'Add Product';

    if (product) {
        Object.keys(product).forEach(key => {
            const input = document.getElementById(`product${key.charAt(0).toUpperCase() + key.slice(1)}`);
            if (input) {
                input.value = product[key];
            }
        });
    } else {
        productForm.reset();
    }

    productModal.style.display = 'block';
}

function closeModal() {
    productModal.style.display = 'none';
    editingProductId = null;
    productForm.reset();
}

// Helper Functions
function showError(message) {
    alert(message);
}

function showSuccess(message) {
    alert(message);
} 