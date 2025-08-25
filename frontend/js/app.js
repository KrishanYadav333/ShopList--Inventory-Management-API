// API Configuration
const API_BASE_URL = 'http://localhost:3000';
const AUTH_HEADER = 'Basic ' + btoa('admin:secret');

// State
let currentPage = 1;
let currentSearch = '';
let products = [];

// DOM Elements
const productForm = document.getElementById('productForm');
const editForm = document.getElementById('editForm');
const editModal = document.getElementById('editModal');
const productsGrid = document.getElementById('productsGrid');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const clearBtn = document.getElementById('clearBtn');
const loading = document.getElementById('loading');
const error = document.getElementById('error');

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    productForm.addEventListener('submit', handleAddProduct);
    editForm.addEventListener('submit', handleEditProduct);
    searchBtn.addEventListener('click', handleSearch);
    clearBtn.addEventListener('click', handleClearSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') handleSearch();
    });
    
    // Modal close events
    document.querySelector('.close').addEventListener('click', closeModal);
    window.addEventListener('click', function(e) {
        if (e.target === editModal) closeModal();
    });
}

// API Functions
async function apiRequest(url, options = {}) {
    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Request failed');
        }
        
        return response.status === 204 ? null : await response.json();
    } catch (err) {
        throw new Error(err.message || 'Network error');
    }
}

// Load Products
async function loadProducts(page = 1, search = '') {
    try {
        showLoading(true);
        hideError();
        
        const params = new URLSearchParams({
            page: page.toString(),
            limit: '12'
        });
        
        if (search) params.append('search', search);
        
        const data = await apiRequest(`${API_BASE_URL}/products?${params}`);
        
        products = data.data;
        renderProducts(products);
        renderPagination(data.page, data.limit, data.total);
        
        currentPage = page;
        currentSearch = search;
        
    } catch (err) {
        showError('Failed to load products: ' + err.message);
    } finally {
        showLoading(false);
    }
}

// Render Products
function renderProducts(products) {
    if (products.length === 0) {
        productsGrid.innerHTML = '<div class="no-products">No products found</div>';
        return;
    }
    
    productsGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-name">${escapeHtml(product.name)}</div>
            <div class="product-description">${escapeHtml(product.description || 'No description')}</div>
            <div class="product-details">
                <div class="product-price">$${parseFloat(product.price).toFixed(2)}</div>
                <div class="product-quantity">Qty: ${product.quantity}</div>
            </div>
            <div class="product-sku">SKU: ${escapeHtml(product.sku)}</div>
            <div class="product-actions">
                <button class="btn-secondary" onclick="editProduct('${product.id}')">Edit</button>
                <button class="btn-danger" onclick="deleteProduct('${product.id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

// Render Pagination
function renderPagination(page, limit, total) {
    const totalPages = Math.ceil(total / limit);
    const pagination = document.getElementById('pagination');
    
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    let paginationHTML = '';
    
    // Previous button
    if (page > 1) {
        paginationHTML += `<button onclick="loadProducts(${page - 1}, '${currentSearch}')">Previous</button>`;
    }
    
    // Page numbers
    for (let i = Math.max(1, page - 2); i <= Math.min(totalPages, page + 2); i++) {
        paginationHTML += `<button class="${i === page ? 'active' : ''}" onclick="loadProducts(${i}, '${currentSearch}')">${i}</button>`;
    }
    
    // Next button
    if (page < totalPages) {
        paginationHTML += `<button onclick="loadProducts(${page + 1}, '${currentSearch}')">Next</button>`;
    }
    
    pagination.innerHTML = paginationHTML;
}

// Add Product
async function handleAddProduct(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const productData = {
        name: document.getElementById('name').value,
        description: document.getElementById('description').value || null,
        price: parseFloat(document.getElementById('price').value),
        quantity: parseInt(document.getElementById('quantity').value),
        sku: document.getElementById('sku').value
    };
    
    try {
        await apiRequest(`${API_BASE_URL}/products`, {
            method: 'POST',
            headers: { Authorization: AUTH_HEADER },
            body: JSON.stringify(productData)
        });
        
        showSuccess('Product added successfully!');
        productForm.reset();
        loadProducts(currentPage, currentSearch);
        
    } catch (err) {
        showError('Failed to add product: ' + err.message);
    }
}

// Edit Product
function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    document.getElementById('editId').value = product.id;
    document.getElementById('editName').value = product.name;
    document.getElementById('editDescription').value = product.description || '';
    document.getElementById('editPrice').value = product.price;
    document.getElementById('editQuantity').value = product.quantity;
    document.getElementById('editSku').value = product.sku;
    
    editModal.style.display = 'block';
}

async function handleEditProduct(e) {
    e.preventDefault();
    
    const id = document.getElementById('editId').value;
    const productData = {
        name: document.getElementById('editName').value,
        description: document.getElementById('editDescription').value || null,
        price: parseFloat(document.getElementById('editPrice').value),
        quantity: parseInt(document.getElementById('editQuantity').value),
        sku: document.getElementById('editSku').value
    };
    
    try {
        await apiRequest(`${API_BASE_URL}/products/${id}`, {
            method: 'PUT',
            headers: { Authorization: AUTH_HEADER },
            body: JSON.stringify(productData)
        });
        
        showSuccess('Product updated successfully!');
        closeModal();
        loadProducts(currentPage, currentSearch);
        
    } catch (err) {
        showError('Failed to update product: ' + err.message);
    }
}

// Delete Product
async function deleteProduct(id) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
        await apiRequest(`${API_BASE_URL}/products/${id}`, {
            method: 'DELETE',
            headers: { Authorization: AUTH_HEADER }
        });
        
        showSuccess('Product deleted successfully!');
        loadProducts(currentPage, currentSearch);
        
    } catch (err) {
        showError('Failed to delete product: ' + err.message);
    }
}

// Search Functions
function handleSearch() {
    const search = searchInput.value.trim();
    loadProducts(1, search);
}

function handleClearSearch() {
    searchInput.value = '';
    loadProducts(1, '');
}

// Modal Functions
function closeModal() {
    editModal.style.display = 'none';
}

// Utility Functions
function showLoading(show) {
    loading.style.display = show ? 'block' : 'none';
    document.getElementById('productsContainer').style.display = show ? 'none' : 'block';
}

function showError(message) {
    error.textContent = message;
    error.style.display = 'block';
    setTimeout(() => error.style.display = 'none', 5000);
}

function hideError() {
    error.style.display = 'none';
}

function showSuccess(message) {
    // Remove existing success messages
    const existingSuccess = document.querySelector('.success');
    if (existingSuccess) existingSuccess.remove();
    
    const successDiv = document.createElement('div');
    successDiv.className = 'success';
    successDiv.textContent = message;
    
    document.querySelector('main').insertBefore(successDiv, document.querySelector('main').firstChild);
    setTimeout(() => successDiv.remove(), 3000);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}