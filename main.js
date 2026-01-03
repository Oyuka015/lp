import './components/home-page.js';
import './components/auth-page.js';
import './components/profile-page.js';

class FoodRushApp {
    constructor() {
        this.currentUser = null;
        this.cart = [];
        this.savedItems = [];
        this.foodItems = [];
        this.categories = [];
        this.currentPage = 'home';
        this.foodsCache = null;
        this.foodsLoading = false;  
        
        this.init();
    }

    async init() { 
        this.loadUserData();
        this.initParticleBackground();
        this.setupRouting();
        await this.loadFoodData();
        this.checkAuthState();
        
        if (typeof window !== 'undefined') {
            setTimeout(() => {
                if (window.apiClient) {
                    console.log('API Client loaded successfully');
                } else {
                    console.log('Using mock data mode');
                }
            }, 100);
        }

        const homePage = document.querySelector('home-page');
        if (homePage) {
            homePage.renderCategories();
            homePage.renderFoodItems();
        }
        
        this.navigateTo(this.getCurrentRoute() || 'home');
    }

    initParticleBackground() {
        const canvas = document.getElementById('particles-canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const particles = [];
        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
        
        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                particle.x += particle.vx;
                particle.y += particle.vy;
                
                if (particle.x < 0) particle.x = canvas.width;
                if (particle.x > canvas.width) particle.x = 0;
                if (particle.y < 0) particle.y = canvas.height;
                if (particle.y > canvas.height) particle.y = 0;
                
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 212, 255, ${particle.opacity})`;
                ctx.fill();
            });
            
            requestAnimationFrame(animateParticles);
        }
        
        animateParticles();
        
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }

    setupRouting() {
        window.addEventListener('hashchange', () => {
            const route = this.getCurrentRoute();
            this.navigateTo(route);
        });
    }

    getCurrentRoute() {
        const hash = window.location.hash.slice(1);
        return hash || 'home';
    }

    navigateTo(page) {
        if (!this.isAuthenticated() && !['login', 'register'].includes(page)) {
            window.location.hash = 'login';
            return;
        }
        if (page === 'saved') {
            const savedPage = document.querySelector('saved-page');
            if (savedPage) {
                savedPage.refresh();
            }
        }else if (page === 'cart'){
            const cartPage = document.querySelector('cart-page');
            if (cartPage) {
                cartPage.refresh();
            }
        }
        this.currentPage = page;
        this.renderPage(page);
        this.updateNavigation();
        window.location.hash = page;

        const container = document.getElementById('page-container');
        if (container) container.scrollTop = 0; 
        window.scrollTo(0, 0);

    }

    renderPage(page) {
        const container = document.getElementById('page-container');
        if (!container) {
            console.error('Page container not found!');
            return;
        }
        
        const pages = container.querySelectorAll('.page-container');
        pages.forEach(p => p.classList.remove('active'));
        
        let pageElement = container.querySelector(`#page-${page}`);
        
        if (!pageElement) {
            pageElement = this.createPageElement(page);
            container.appendChild(pageElement);
        }
        
        pageElement.classList.add('active');
        
    }
    

    createPageElement(page) {
        const pageElement = document.createElement('div');
        pageElement.id = `page-${page}`;
        pageElement.className = 'page-container';
        
        switch (page) {
            case 'login':
                pageElement.innerHTML = '<auth-page mode="login"></auth-page>';
                break;
            case 'register':
                pageElement.innerHTML = '<auth-page mode="register"></auth-page>';
                break;
            case 'home':
                pageElement.innerHTML = '<home-page></home-page>';
                break;
            case 'saved':
                pageElement.innerHTML = '<saved-page></saved-page>';
                break;
            case 'cart':
                pageElement.innerHTML = '<cart-page></cart-page>';
                break;
            case 'profile':
                pageElement.innerHTML = '<profile-page></profile-page>';
                break;
            case 'order':
                pageElement.innerHTML = '<order-page></order-page>';
                break;
            default:
                pageElement.innerHTML = '<home-page></home-page>';
        }
        
        return pageElement;
    }

    isAuthenticated() {
        return !!localStorage.getItem('token');
    }

    checkAuthState() {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (token && userData) {
            this.currentUser = JSON.parse(userData);
            this.currentUser.token = token;  
        }else {
            this.currentUser = null; // токен байхгүй бол null
        } 

    }

    async login(email, password) {
        try {
            if (window.apiClient) {
                const response = await window.apiClient.login(email, password);
                
                if (response.success) {
                    const user = response.data.user;
                    const token = response.data.token;
                    
                    localStorage.setItem('token', token);
                    localStorage.setItem('user', JSON.stringify(user));
                    this.currentUser = user;
                    
                    this.navigateTo('home');
                    this.showNotification('Login successful!', 'success');
                    return true;
                } else {
                    this.showNotification(response.error || 'Login failed', 'error');
                    return false;
                }
            } else {
                const mockUser = {
                    id: 'user-1',
                    name: 'John Doe',
                    email: email,
                    address: '123 Main St, City, Country',
                    phone: '+1234567890'
                };
                
                localStorage.setItem('token', 'mock-jwt-token');
                localStorage.setItem('user', JSON.stringify(mockUser));
                this.currentUser = mockUser;
                
                this.navigateTo('home');
                return true;
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showNotification('Login failed. Please try again.', 'error');
            return false;
        }
    }

    async register(userData) {
        try {
            if (window.apiClient) {
                const response = await window.apiClient.register(userData);
                
                if (response.success) {
                    const user = response.data.user;
                    const token = response.data.token;
                    
                    localStorage.setItem('token', token);
                    localStorage.setItem('user', JSON.stringify(user));
                    this.currentUser = user;
                    
                    this.navigateTo('home');
                    this.showNotification('Registration successful!', 'success');
                    return true;
                } else {
                    this.showNotification(response.error || 'Registration failed', 'error');
                    return false;
                }
            } else {
                // Mock registration (fallback)
                const mockUser = {
                    id: 'user-' + Date.now(),
                    name: userData.name,
                    email: userData.email,
                    address: userData.address,
                    phone: userData.phone
                };
                
                localStorage.setItem('token', 'mock-jwt-token');
                localStorage.setItem('user', JSON.stringify(mockUser));
                this.currentUser = mockUser;
                
                this.navigateTo('home');
                return true;
            }
        } catch (error) {
            console.error('Registration error:', error);
            this.showNotification('Registration failed. Please try again.', 'error');
            return false;
        }
    }

    async logout() {
        try {
            if (window.apiClient) {
                window.apiClient.logout();
            }
            
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('cart');
            localStorage.removeItem('saved');
            
            this.currentUser = null;
            this.cart = [];
            this.savedItems = [];
            
            this.navigateTo('login');
            this.showNotification('Logged out successfully', 'success');
        } catch (error) {
            console.error('Logout error:', error);
            // Still logout even if API call fails
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('cart');
            localStorage.removeItem('saved');
            
            this.currentUser = null;
            this.cart = [];
            this.savedItems = [];
            
            this.navigateTo('login');
        }
    }

    // Data Management
    loadUserData() {
        const savedCart = localStorage.getItem('cart');
        const savedItems = localStorage.getItem('saved');
        
        if (savedCart) {
            this.cart = JSON.parse(savedCart);
        }
        
        if (savedItems) {
            this.savedItems = JSON.parse(savedItems);
        }
    }

    saveUserData() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
        localStorage.setItem('saved', JSON.stringify(this.savedItems));
    }
    // 
    async getFoods(force = false) {
        if (this.foodsCache && !force) {
            return this.foodsCache;
        }

        if (this.foodsLoading) return [];

        this.foodsLoading = true;

        try {
            const res = await window.apiClient.getFoods();

            if (!res.success) {
                throw new Error('Failed to fetch foods');
            }

            this.foodsCache = res.data.map(food => ({
                id: food.id,
                name: food.name,
                category: food.category?.slug || 'all',
                price: Number(food.price),
                image: food.image,
                description: food.description,
                rating: food.rating,
                deliveryTime: food.delivery_time,
                restaurant: food.restaurant?.name || 'Unknown'
            }));

            return this.foodsCache;
        } catch (e) {
            console.error('❌ getFoods error', e);
            return [];
        } finally {
            this.foodsLoading = false;
        }
    }

    clearFoodsCache() {
        this.foodsCache = null;
    }
    // 

    async loadFoodData() {
       
        try {
            const categoriesRes = await window.apiClient.getCategories();
            if (categoriesRes.success) {
                this.categories = categoriesRes.data;
            }

            this.foodItems = await window.foodRushApp.getFoods();

        } catch (err) {
            console.error(err);
            this.loadMockData();
        }
    }

    loadMockData() {
        this.categories = [
            { id: 'all', name: 'All Food', icon: ' ' },
            { id: 'pizza', name: 'Pizza', icon: ' ' },
            { id: 'burger', name: 'Burgers', icon: ' ' },
            { id: 'sushi', name: 'Sushi', icon: ' ' },
            { id: 'pasta', name: 'Pasta', icon: ' ' },
            { id: 'salad', name: 'Salads', icon: ' ' },
            { id: 'dessert', name: 'Desserts', icon: ' ' },
            { id: 'drinks', name: 'Drinks', icon: ' ' }
        ];

        this.foodItems = [
            {
                id: 'food-1',
                name: 'Pepperoni Pizza',
                category: 'pizza',
                price: 18.99,
                image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop',
                description: 'Classic pepperoni pizza with mozzarella cheese and tomato sauce',
                rating: 4.5,
                deliveryTime: '25-35 min',
                restaurant: 'Pizza Palace'
            },
            {
                id: 'food-2',
                name: 'Cheeseburger Deluxe',
                category: 'burger',
                price: 12.99,
                image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop',
                description: 'Juicy beef patty with cheese, lettuce, tomato, and special sauce',
                rating: 4.7,
                deliveryTime: '20-30 min',
                restaurant: 'Burger Barn'
            },
            {
                id: 'food-3',
                name: 'Salmon Sushi Roll',
                category: 'sushi',
                price: 24.99,
                image: 'https://images.unsplash.com/photo-1617196035154-c11f0f6162e0?w=300&h=200&fit=crop',
                description: 'Fresh salmon with avocado, cucumber, and sushi rice',
                rating: 4.9,
                deliveryTime: '30-40 min',
                restaurant: 'Sushi Zen'
            },
            {
                id: 'food-4',
                name: 'Creamy Alfredo Pasta',
                category: 'pasta',
                price: 16.99,
                image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=300&h=200&fit=crop',
                description: 'Fettuccine pasta with creamy alfredo sauce and parmesan',
                rating: 4.6,
                deliveryTime: '25-35 min',
                restaurant: 'Pasta Perfection'
            },
            {
                id: 'food-5',
                name: 'Caesar Salad',
                category: 'salad',
                price: 11.99,
                image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=300&h=200&fit=crop',
                description: 'Crisp romaine lettuce with caesar dressing and croutons',
                rating: 4.3,
                deliveryTime: '15-25 min',
                restaurant: 'Fresh Greens'
            },
            {
                id: 'food-6',
                name: 'Chocolate Lava Cake',
                category: 'dessert',
                price: 8.99,
                image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300&h=200&fit=crop',
                description: 'Warm chocolate cake with molten chocolate center',
                rating: 4.8,
                deliveryTime: '20-30 min',
                restaurant: 'Sweet Dreams'
            },
            {
                id: 'food-7',
                name: 'Fresh Fruit Smoothie',
                category: 'drinks',
                price: 6.99,
                image: 'https://images.unsplash.com/photo-1546173159-315dafa75780?w=300&h=200&fit=crop',
                description: 'Blend of fresh fruits with yogurt and honey',
                rating: 4.4,
                deliveryTime: '10-20 min',
                restaurant: 'Smoothie Station'
            },
            {
                id: 'food-8',
                name: 'Margherita Pizza',
                category: 'pizza',
                price: 15.99,
                image: 'https://images.unsplash.com/photo-1574071318502-1e0d82dc4c8b?w=300&h=200&fit=crop',
                description: 'Classic margherita with fresh mozzarella and basil',
                rating: 4.6,
                deliveryTime: '25-35 min',
                restaurant: 'Pizza Palace'
            },
            {
                id: 'food-9',
                name: 'BBQ Bacon Burger',
                category: 'burger',
                price: 14.99,
                image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=300&h=200&fit=crop',
                description: 'Beef patty with BBQ sauce, bacon, and onion rings',
                rating: 4.8,
                deliveryTime: '25-35 min',
                restaurant: 'Burger Barn'
            },
            {
                id: 'food-10',
                name: 'Tuna Sashimi',
                category: 'sushi',
                price: 28.99,
                image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4350?w=300&h=200&fit=crop',
                description: 'Fresh tuna sashimi with wasabi and soy sauce',
                rating: 4.9,
                deliveryTime: '30-40 min',
                restaurant: 'Sushi Zen'
            }
        ];
    }

    async addToCart(foodId, quantity = 1) { 
        const token = localStorage.getItem('token');

        const res = await fetch('http://localhost:5500/api/cart/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ foodId, quantity })
        });

        if (!res.ok) {
            this.showNotification('Failed to add to cart', 'error');
            return false;
        }

        await this.syncCartFromServer();
        this.showNotification('Added to cart!', 'success');
        return true;
    }
    async syncCartFromServer() {
        const token = localStorage.getItem('token');

        const res = await fetch('http://localhost:5500/api/cart', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!res.ok) return;

        const result = await res.json();

        this.cart = result.data.items.map(item => ({
            foodId: item.id,
            quantity: item.quantity,
            price: item.price,
            name: item.name,
            image: item.image
        }));


        this.updateCartCounter();
    }

    removeFromCart(foodId) {
        this.cart = this.cart.filter(item => item.foodId !== foodId);
        this.saveUserData();
        this.updateCartCounter();
    }

    async updateCartQuantity(foodId, quantity) {
        const token = localStorage.getItem('token');

        await fetch('http://localhost:5500/api/cart/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ foodId, quantity })
        });

        await this.syncCartFromServer();
    }

    getCartTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getCartItemCount() {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
    }

    updateCartCounter() {
        const cartCounter = document.querySelector('.cart-counter');
        const count = this.getCartItemCount();
        
        if (cartCounter) {
            cartCounter.textContent = count;
            cartCounter.style.display = count > 0 ? 'block' : 'none';
            
            if (count > 0) {
                // Pulse animation
                anime({
                    targets: cartCounter,
                    scale: [1, 1.3, 1],
                    duration: 300,
                    easing: 'easeOutElastic(1, .6)'
                });
            }
        }
    }

    // Saved Items Management 
    async toggleSaveItem(foodId) {
        const token = localStorage.getItem('token');
        const isSaved = this.savedItems.includes(foodId); // ✅ ЗААВАЛ

        if (isSaved) {
            await fetch(`http://localhost:5500/api/saved/${foodId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            this.savedItems = this.savedItems.filter(id => id !== foodId);
        } else {
            await fetch(`http://localhost:5500/api/saved/${foodId}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            this.savedItems.push(foodId);
        }
    }

    isItemSaved(foodId) {
        return this.savedItems.includes(foodId);
    } 
 
    async getSavedFoods() {
        const token = localStorage.getItem('token');

        const res = await fetch('http://localhost:5500/api/saved', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!res.ok) {
            throw new Error('Failed to fetch saved foods');
        }

        const result = await res.json();

        return result.data; // ✅ ЗААВАЛ .data
    }

    // Utility Functions
    updateNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            const page = item.dataset.page;
            if (page === this.currentPage) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 24px;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        `;
        
        switch (type) {
            case 'success':
                notification.style.background = 'linear-gradient(135deg, #00D4FF, #0099CC)';
                break;
            case 'error':
                notification.style.background = 'linear-gradient(135deg, #FF006B, #CC0055)';
                break;
            default:
                notification.style.background = 'linear-gradient(135deg, #1A1A1A, #333333)';
        }
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Search and Filter
    searchFoods(query) {
        const lowercaseQuery = query.toLowerCase();
        return this.foodItems.filter(food => 
            food.name.toLowerCase().includes(lowercaseQuery) ||
            food.description.toLowerCase().includes(lowercaseQuery) ||
            food.restaurant.toLowerCase().includes(lowercaseQuery)
        );
    }

        filterByCategory(category) {
            if (category === 'all') {
                return this.foodItems;
            }
            return this.foodItems.filter(food => food.category === category);
        }

    // Checkout Process
    async checkout() {
        if (this.cart.length === 0) {
            this.showNotification('Cart is empty', 'error');
            return false;
        }

        try {
            if (window.apiClient) {
                // Get current user
                const userResponse = await window.apiClient.getCurrentUser();
                const deliveryAddress = userResponse.success && userResponse.data.user.address 
                    ? userResponse.data.user.address 
                    : 'No address provided';

                // **Order request server-side**
                const orderResponse = await window.apiClient.createOrder({
                    deliveryAddress: deliveryAddress,
                    notes: 'Order placed through Food app'
                    // **Items are ignored by server; server reads from cart_items table**
                });

                if (orderResponse.success) {
                    // **Only after successful API response**, clear cart
                    this.showNotification('Order placed successfully!', 'success');

                    // Clear client cart and save
                    this.cart = [];
                    this.saveUserData();
                    this.updateCartCounter();

                    setTimeout(() => {
                        this.navigateTo('home');
                    }, 2000);

                    return true;
                } else {
                    this.showNotification(orderResponse.error || 'Order failed', 'error');
                    return false;
                }
            } else {
                // Mock checkout fallback
                this.showNotification('Order placed (mock)', 'success');
                this.cart = [];
                this.saveUserData();
                this.updateCartCounter();
                this.navigateTo('home');
                return true;
            }
        } catch (error) {
            console.error('Checkout error:', error);
            this.showNotification('Checkout failed. Please try again.', 'error');
            return false;
        }
    }

    // Orders 
    async getOrders() {
        const token = localStorage.getItem('token');

        const res = await fetch('http://localhost:5500/api/orders', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!res.ok) {
            throw new Error('Failed to fetch orders');
        }

        const result = await res.json();

        return result.data;
    }

}

document.addEventListener('DOMContentLoaded', () => {
    const app = new FoodRushApp(); 
    window.foodRushApp = app;
}); 