// API Client for FoodRush Frontend
// This module handles all communication with the backend API

class ApiClient {
    constructor() {
        // this.baseURL = 'http://localhost:5000/api'; // Backend API URL
        this.baseURL = 'http://localhost:5500/api'; // Backend API URL
        this.token = localStorage.getItem('token'); // JWT token from localStorage
    }

    // Set auth token
    setToken(token) {
        this.token = token;
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    }

    // Make API request
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        
        // Set up headers
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        // Add auth token if available
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        // Set up request options
        const requestOptions = {
            method: options.method || 'GET',
            headers,
            ...options
        };

        // Add body for POST/PUT requests
        if (options.body && typeof options.body === 'object') {
            requestOptions.body = JSON.stringify(options.body);
        }

        try {
            const response = await fetch(url, requestOptions);
            
            // Parse response
            const data = await response.json();
            
            // Handle errors
            if (!response.ok) {
                throw new Error(data.message || 'Request failed');
            }
            
            return {
                success: true,
                data: data.data || data,
                message: data.message
            };

        } catch (error) {
            console.error(`❌ API request failed: ${endpoint}`, error);
            return {
                success: false,
                error: error.message,
                details: 'Network request failed'
            };
        }
    }

    // ==================== AUTH API ====================

    // Register new user
    async register(userData) {
        return await this.request('/auth/register', {
            method: 'POST',
            body: userData
        });
    }

    // Login user
    async login(email, password) {
        const response = await this.request('/auth/login', {
            method: 'POST',
            body: { email, password }
        });

        // Save token if login successful
        if (response.success && response.data.token) {
            this.setToken(response.data.token);
        }

        return response;
    }

    // Get current user
    async getCurrentUser() {
        return await this.request('/auth/me');
    }

    // ==================== USERS API ====================

    // Get user profile
    async getUserProfile() {
        return await this.request('/users/profile');
    }

    // Update user profile
    async updateUserProfile(profileData) {
        return await this.request('/users/profile', {
            method: 'PUT',
            body: profileData
        });
    }

    // Change password
    async changePassword(currentPassword, newPassword) {
        return await this.request('/users/change-password', {
            method: 'PUT',
            body: { currentPassword, newPassword }
        });
    }

    // Delete account
    async deleteAccount() {
        return await this.request('/users/account', {
            method: 'DELETE'
        });
    }

    // ==================== FOODS API ====================

    // Get all foods with optional filters
    async getFoods(filters = {}) {
        const queryParams = new URLSearchParams(filters);
        const endpoint = `/foods${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
        return await this.request(endpoint);
    }

    // Get single food by ID
    async getFoodById(foodId) {
        return await this.request(`/foods/${foodId}`);
    }

    // Get all categories
    async getCategories() {
        return await this.request('/foods/categories/all');
    }

    // Save/unsave food
    async toggleSaveFood(foodId) {
        return await this.request(`/foods/${foodId}/save`, {
            method: 'POST'
        });
    }

    // Get user's saved foods
    async getSavedFoods() {
        return await this.request('/foods/saved/all');
    }

    // ==================== CART API ====================

    // Get cart
    async getCart() {
        return await this.request('/cart');
    }

    // Add item to cart
    async addToCart(foodId, quantity = 1) {
        return await this.request('/cart/add', {
            method: 'POST',
            body: { foodId, quantity }
        });
    }

    // Update cart item quantity
    async updateCartItem(foodId, quantity) {
        return await this.request('/cart/update', {
            method: 'PUT',
            body: { foodId, quantity }
        });
    }

    // Remove item from cart
    async removeFromCart(foodId) {
        return await this.request(`/cart/remove/${foodId}`, {
            method: 'DELETE'
        });
    }

    // Clear cart
    async clearCart() {
        return await this.request('/cart/clear', {
            method: 'DELETE'
        });
    }

    // ==================== ORDERS API ====================

    // Get user's orders
    async getOrders(filters = {}) {
        const queryParams = new URLSearchParams(filters);
        const endpoint = `/orders${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
        return await this.request(endpoint);
    }

    // Get single order by ID
    async getOrderById(orderId) {
        return await this.request(`/orders/${orderId}`);
    }

    // Create new order
    async createOrder(orderData) {
        return await this.request('/orders', {
            method: 'POST',
            body: orderData
        });
    }

    // Update order status
    async updateOrderStatus(orderId, status) {
        return await this.request(`/orders/${orderId}/status`, {
            method: 'PUT',
            body: { status }
        });
    }

    // Cancel order
    async cancelOrder(orderId) {
        return await this.request(`/orders/${orderId}`, {
            method: 'DELETE'
        });
    }

    // ==================== UTILITY METHODS ====================

    // Check if user is authenticated
    isAuthenticated() {
        return !!this.token;
    }

    // Logout (clear token)
    logout() {
        this.setToken(null);
    }

    // Get auth headers for manual requests
    getAuthHeaders() {
        const headers = { 'Content-Type': 'application/json' };
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        return headers;
    }
}

// Create and export singleton instance
const apiClient = new ApiClient();

// Make it globally available for use in components
if (typeof window !== 'undefined') {
    window.apiClient = apiClient;
}

// module.exports = apiClient;