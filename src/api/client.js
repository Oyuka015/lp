class ApiClient {
    constructor() {
        this.baseURL = 'http://localhost:5500/api'; 
        this.token = localStorage.getItem('token'); 
    }
    setToken(token) {
        this.token = token;
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    }
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        const requestOptions = {
            method: options.method || 'GET',
            headers,
            ...options
        };

        if (options.body && typeof options.body === 'object') {
            requestOptions.body = JSON.stringify(options.body);
        }

        try {
            const response = await fetch(url, requestOptions);
            
            const data = await response.json();
            
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


    async register(userData) {
        return await this.request('/auth/register', {
            method: 'POST',
            body: userData
        });
    }

    async login(email, password) {
        const response = await this.request('/auth/login', {
            method: 'POST',
            body: { email, password }
        });

        if (response.success && response.data.token) {
            this.setToken(response.data.token);
        }

        return response;
    }

    async getCurrentUser() {
        return await this.request('/auth/me');
    }

    async getUserProfile() {
        return await this.request('/users/profile');
    }

    async updateUserProfile(profileData) {
        return await this.request('/users/profile', {
            method: 'PUT',
            body: profileData
        });
    }

    async changePassword(currentPassword, newPassword) {
        return await this.request('/users/change-password', {
            method: 'PUT',
            body: { currentPassword, newPassword }
        });
    }

    async deleteAccount() {
        return await this.request('/users/account', {
            method: 'DELETE'
        });
    }

    async getFoods(filters = {}) {
        const queryParams = new URLSearchParams(filters);
        const endpoint = `/foods${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
        return await this.request(endpoint);
    }

    async getFoodById(foodId) {
        return await this.request(`/foods/${foodId}`);
    }

    async getCategories() {
        return await this.request('/foods/categories/all');
    }

    async toggleSaveFood(foodId) {
        return await this.request(`/foods/${foodId}/save`, {
            method: 'POST'
        });
    }

    async getSavedFoods() {
        return await this.request('/foods/saved/all');
    }

    
    async getCart() {
        return await this.request('/cart');
    }

    async addToCart(foodId, quantity = 1) {
        return await this.request('/cart/add', {
            method: 'POST',
            body: { foodId, quantity }
        });
    }

    async updateCartItem(foodId, quantity) {
        return await this.request('/cart/update', {
            method: 'PUT',
            body: { foodId, quantity }
        });
    }

    async removeFromCart(foodId) {
        return await this.request(`/cart/remove/${foodId}`, {
            method: 'DELETE'
        });
    }

    async clearCart() {
        return await this.request('/cart/clear', {
            method: 'DELETE'
        });
    }

 
    async getOrders(filters = {}) {
        const queryParams = new URLSearchParams(filters);
        const endpoint = `/orders${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
        return await this.request(endpoint);
    }

    async getOrderById(orderId) {
        return await this.request(`/orders/${orderId}`);
    }

    async createOrder(orderData) {
        return await this.request('/orders', {
            method: 'POST',
            body: orderData
        });
    }

    async updateOrderStatus(orderId, status) {
        return await this.request(`/orders/${orderId}/status`, {
            method: 'PUT',
            body: { status }
        });
    }

    async cancelOrder(orderId) {
        return await this.request(`/orders/${orderId}`, {
            method: 'DELETE'
        });
    }


    isAuthenticated() {
        return !!this.token;
    }

    logout() {
        this.setToken(null);
    }

    getAuthHeaders() {
        const headers = { 'Content-Type': 'application/json' };
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        return headers;
    }
}

const apiClient = new ApiClient();

if (typeof window !== 'undefined') {
    window.apiClient = apiClient;
}
