// Home Page Component for FoodRush App
class HomePage extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.currentCategory = 'all';
        this.searchQuery = '';
        // this.theme = 'dark'; // default
        // this.setAttribute('theme', this.theme);
        this.render();
        this.setupEventListeners();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    min-height: 100vh;
                    background-color: var(--bg-primary);
                    color: var(--text-primary);
                    font-family: var(--font-body);
                }
                :host([theme="dark"]) {
                    --bg-primary: #0A0A0A;
                    --bg-secondary: #1A1A1A;
                    --accent-primary: #00D4FF;
                    --accent-secondary: #FF006B;
                    --text-primary: #FFFFFF;
                    --text-secondary: #B0B0B0;
                    --font-display: 'Orbitron', monospace;
                    --font-body: 'Inter', sans-serif;
                    
                    --bg-other-1: rgba(26, 26, 26, 0.6);
                    --bg-other-2: rgba(26, 26, 26, 0.8);
                }

                :host([theme="light"]) {
                    --bg-primary: #dadada;
                    --bg-secondary: #F5F5F5;
                    --accent-primary: #00D4FF;
                    --accent-secondary: #FF006B;
                    --text-primary: #000000;
                    --text-secondary: #555555;
                    --font-display: 'Orbitron', monospace;
                    --font-body: 'Inter', sans-serif;

                    --bg-other-1: rgba(245, 245, 245, 0.6);
                    --bg-other-2: rgba(245, 245, 245, 0.8);
                }

                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                .home-container {
                    min-height: 100vh;
                    padding: 20px 16px 80px;
                }
                .hidden { display: none; }

                /* Header Section */
                .header-section {
                    margin-bottom: 24px;
                }

                .welcome-text {
                    font-family: var(--font-display);
                    font-size: 28px;
                    font-weight: 700;
                    color: var(--text-primary);
                    margin-bottom: 8px;
                    text-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
                }

                .delivery-address {
                    display: flex;
                    align-items: center; 
                    background: var(--bg-other-1);
                    border: 1px solid rgba(0, 212, 255, 0.2);
                    border-radius: 12px;
                    padding: 12px 16px;
                    margin-bottom: 20px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .delivery-address:hover {
                    border-color: var(--accent-primary);
                    box-shadow: 0 4px 20px rgba(0, 212, 255, 0.2);
                }

                .address-icon {
                    width: 20px;
                    height: 20px;
                    margin-right: 12px;
                    background: var(--accent-primary);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--bg-primary);
                    font-size: 12px;
                }

                .address-text {
                    flex: 1;
                    font-size: 14px;
                    color: var(--text-primary);
                }

                .address-edit {
                    color: var(--accent-primary);
                    font-size: 12px;
                    font-weight: 600;
                }

                /* Search Section */
                .search-section {
                    margin-bottom: 24px;
                }

                .search-container {
                    position: relative;
                }

                .search-input {
                    width: 100%;
                    padding: 16px 20px 16px 50px;
                    background: var(--bg-other-2);
                    border: 2px solid transparent;
                    border-radius: 12px;
                    color: var(--text-primary);
                    font-family: var(--font-body);
                    font-size: 16px;
                    transition: all 0.3s ease;
                }

                .search-input:focus {
                    outline: none;
                    border-color: var(--accent-primary);
                    box-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
                }

                .search-input::placeholder {
                    color: var(--text-secondary);
                }

                .search-icon {
                    position: absolute;
                    left: 16px;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 20px;
                    height: 20px;
                    color: var(--text-secondary);
                }

                .clear-search {
                    position: absolute;
                    right: 16px;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 20px;
                    height: 20px;
                    color: var(--text-secondary);
                    cursor: pointer;
                    display: none;
                    transition: all 0.3s ease;
                }

                .clear-search:hover {
                    color: var(--accent-secondary);
                }

                .clear-search.show {
                    display: block;
                }

                /* Categories Section */
                .categories-section {
                    margin-bottom: 24px;
                }

                .section-title {
                    font-family: var(--font-display);
                    font-size: 18px;
                    font-weight: 700;
                    color: var(--text-primary);
                    margin-bottom: 16px;
                }

                .categories-container {
                    display: flex;
                    gap: 12px;
                    overflow-x: auto;
                    padding-bottom: 8px;
                    scrollbar-width: thin;
                    scrollbar-color: var(--accent-primary) transparent;
                }

                .categories-container::-webkit-scrollbar {
                    height: 4px;
                }

                .categories-container::-webkit-scrollbar-track {
                    background: rgba(26, 26, 26, 0.5);
                    border-radius: 2px;
                }

                .categories-container::-webkit-scrollbar-thumb {
                    background: var(--accent-primary);
                    border-radius: 2px;
                }

                .category-pill {
                    flex-shrink: 0;
                    padding: 8px 16px;
                    background: var(--bg-other-1);
                    border: 1px solid rgba(0, 212, 255, 0.2);
                    border-radius: 20px;
                    color: var(--text-secondary);
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .category-pill:hover {
                    border-color: var(--accent-primary);
                    color: var(--accent-primary);
                }

                .category-pill.active {
                    background: linear-gradient(135deg, var(--accent-primary), #0099CC);
                    border-color: var(--accent-primary);
                    color: var(--text-primary);
                    box-shadow: 0 4px 15px rgba(0, 212, 255, 0.3);
                }

                /* Food Grid */
                .food-section {
                    margin-bottom: 24px;
                }

                .food-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 16px;
                }

                .food-card {
                    background: var(--bg-other-2);
                    border: 1px solid rgba(0, 212, 255, 0.1);
                    border-radius: 12px;
                    overflow: hidden;
                    transition: all 0.3s ease;
                    cursor: pointer;
                }

                .food-card:hover {
                    transform: translateY(-4px);
                    border-color: var(--accent-primary);
                    box-shadow: 0 8px 25px rgba(0, 212, 255, 0.2);
                }

                .food-image {
                    width: 100%;
                    height: 180px;
                    object-fit: cover;
                    transition: all 0.3s ease;
                }

                .food-card:hover .food-image {
                    transform: scale(1.05);
                }

                .food-info {
                    padding: 16px;
                }

                .food-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 8px;
                }

                .food-name {
                    font-size: 16px;
                    font-weight: 600;
                    color: var(--text-primary);
                    margin-bottom: 4px;
                }

                .food-restaurant {
                    font-size: 12px;
                    color: var(--text-secondary);
                }

                .food-price {
                    font-family: var(--font-mono);
                    font-size: 18px;
                    font-weight: 700;
                    color: var(--accent-primary);
                }

                .food-description {
                    font-size: 14px;
                    color: var(--text-secondary);
                    margin-bottom: 12px;
                    line-height: 1.4;
                }

                .food-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .food-rating {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    font-size: 12px;
                    color: var(--text-secondary);
                }

                .rating-stars {
                    color: #FFD700;
                }

                .food-actions {
                    display: flex;
                    gap: 8px;
                }

                .action-btn {
                    width: 36px;
                    height: 36px;
                    border: none;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-size: 16px;
                }

                .save-btn {
                    background: rgba(255, 0, 107, 0.1);
                    color: var(--accent-secondary);
                    border: 1px solid rgba(255, 0, 107, 0.3);
                }

                .save-btn:hover {
                    background: var(--accent-secondary);
                    color: var(--text-primary);
                    transform: scale(1.1);
                }

                .save-btn.saved {
                    background: var(--accent-secondary);
                    color: var(--text-primary);
                    animation: heartBeat 0.3s ease-out;
                }

                @keyframes heartBeat {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.2); }
                    100% { transform: scale(1); }
                }

                .cart-btn {
                    background: linear-gradient(135deg, var(--accent-primary), #0099CC);
                    color: var(--text-primary);
                }

                .cart-btn:hover {
                    transform: scale(1.1);
                    box-shadow: 0 4px 15px rgba(0, 212, 255, 0.4);
                }

                /* Empty State */
                .empty-state {
                    text-align: center;
                    padding: 60px 20px;
                    color: var(--text-secondary);
                }
                .empty-state.hidden {
                    display: none;
                }

                .empty-icon {
                    font-size: 48px;
                    margin-bottom: 16px;
                    opacity: 0.5;
                }

                .empty-text {
                    font-size: 16px;
                    margin-bottom: 8px;
                }

                .empty-subtext {
                    font-size: 14px;
                    opacity: 0.7;
                }

                /* Loading State */
                .loading-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 40px;
                }

                .loading-spinner {
                    width: 40px;
                    height: 40px;
                    border: 3px solid rgba(0, 212, 255, 0.1);
                    border-radius: 50%;
                    border-top-color: var(--accent-primary);
                    animation: spin 1s ease-in-out infinite;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                /* Address Modal */
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.8);
                    display: none;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                }

                .modal-overlay.show {
                    display: flex;
                }

                .modal-content {
                    background: var(--bg-secondary);
                    border: 1px solid rgba(0, 212, 255, 0.2);
                    border-radius: 16px;
                    padding: 24px;
                    width: 90%;
                    max-width: 400px;
                }

                .modal-title {
                    font-family: var(--font-display);
                    font-size: 20px;
                    font-weight: 700;
                    color: var(--text-primary);
                    margin-bottom: 16px;
                }

                .modal-actions {
                    display: flex;
                    gap: 12px;
                    margin-top: 20px;
                }

                .modal-btn {
                    flex: 1;
                    padding: 12px;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .modal-btn-primary {
                    background: var(--accent-primary);
                    color: var(--text-primary);
                }

                .modal-btn-secondary {
                    background: transparent;
                    border: 2px solid var(--text-secondary);
                    color: var(--text-secondary);
                }
                
                .category-icon.pizza::before {
                    content: "🍕";
                    font-size:20px;
                }
                .category-icon.burgers::before {
                    content: "🍔";
                    font-size:20px;
                }
                .category-icon.drinks::before {
                    content: "🥤";
                    font-size:20px;
                }
                .category-icon.desserts::before {
                    content: "🍰";
                    font-size:20px;
                }
                .category-icon.pasta::before {
                    content: "🍝";
                    font-size:20px;
                }
                .category-icon.salads::before {
                    content: "🥗";
                    font-size:20px;
                }
                .category-icon.sushi::before {
                    content: "🍣";
                    font-size:20px;
                }

                @media (max-width: 768px) {
                    .home-container {
                        padding: 16px 12px 80px;
                    }
                    
                    .food-grid {
                        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                        gap: 12px;
                    }
                    
                    .welcome-text {
                        font-size: 24px;
                    }
                }

                @media (max-width: 480px) {
                    .food-grid {
                        grid-template-columns: 1fr;
                    }
                }
            </style>
            
            <div class="home-container">
                <!-- Header Section -->
                <div class="header-section">
                    <h1 class="welcome-text">What would you like to eat?</h1>
                    
                    <div class="delivery-address" id="address-display">
                        <div class="address-icon">📍</div>
                        <div class="address-text" id="current-address">
                            Loading address...
                        </div>
                        <div class="address-edit">Change</div>
                    </div>
                </div>
                
                <!-- Search Section -->
                <div class="search-section">
                    <div class="search-container">
                        <div class="search-icon">🔍</div>
                        <input type="text" class="search-input" id="search-input" placeholder="Search for food...">
                        <div class="clear-search" id="clear-search">✕</div>
                    </div>
                </div>
                
                <!-- Categories Section -->
                <div class="categories-section">
                    <h2 class="section-title">Categories</h2>
                    <div class="categories-container" id="categories-container">
                        <!-- Categories will be dynamically loaded -->
                    </div>
                </div>
                
                <!-- Food Grid -->
                <div class="food-section">
                    <h2 class="section-title">Available Foods</h2>
                    <div class="food-grid" id="food-grid">
                        <!-- Food items will be dynamically loaded -->
                    </div>
                    
                    <div class="loading-container" id="loading-container">
                        <div class="loading-spinner"></div>
                    </div>
                    
                    <div class="empty-state hidden" id="empty-state">
                        <div class="empty-icon">🍽️</div>
                        <div class="empty-text">No food found</div>
                        <div class="empty-subtext">Try adjusting your search or category filter</div>
                    </div>
                </div>
            </div>
            
            <!-- Address Modal -->
            <div class="modal-overlay" id="address-modal">
                <div class="modal-content">
                    <h3 class="modal-title">Update Delivery Address</h3>
                    <input type="text" class="form-input" id="new-address" placeholder="Enter new delivery address">
                    <div class="modal-actions">
                        <button class="modal-btn modal-btn-secondary" id="cancel-address">Cancel</button>
                        <button class="modal-btn modal-btn-primary" id="save-address">Save Address</button>
                    </div>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = this.shadowRoot.getElementById('search-input');
        const clearSearch = this.shadowRoot.getElementById('clear-search');
        
        searchInput.addEventListener('input', (e) => {
            this.searchQuery = e.target.value;
            this.filterFoods();
            
            if (e.target.value) {
                clearSearch.classList.add('show');
            } else {
                clearSearch.classList.remove('show');
            }
        });

        clearSearch.addEventListener('click', () => {
            searchInput.value = '';
            this.searchQuery = '';
            this.filterFoods();
            clearSearch.classList.remove('show');
        });

        // Address change functionality
        const addressDisplay = this.shadowRoot.getElementById('address-display');
        const addressModal = this.shadowRoot.getElementById('address-modal');
        const cancelAddress = this.shadowRoot.getElementById('cancel-address');
        const saveAddress = this.shadowRoot.getElementById('save-address');
        const newAddressInput = this.shadowRoot.getElementById('new-address');

        addressDisplay.addEventListener('click', () => {
            const currentAddress = this.shadowRoot.getElementById('current-address').textContent;
            newAddressInput.value = currentAddress;
            addressModal.classList.add('show');
        });

        cancelAddress.addEventListener('click', () => {
            addressModal.classList.remove('show');
        });

        saveAddress.addEventListener('click', () => {
            const newAddress = newAddressInput.value.trim();
            if (newAddress) {
                this.updateAddress(newAddress);
                addressModal.classList.remove('show');
            }
        });

        // Close modal on overlay click
        addressModal.addEventListener('click', (e) => {
            if (e.target === addressModal) {
                addressModal.classList.remove('show');
            }
        });
    }

    connectedCallback() {
        this.loadData();
        this.currentCategory = 'all';

        this.addEventListener('category-selected', (e) => {
            this.currentCategory = e.detail.categoryId;

            // this.updateActivePills();
            this.filterFoods();
            
        });
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            this.shadowRoot.host.setAttribute('theme', savedTheme);
        } else {
            this.shadowRoot.host.setAttribute('theme', 'light');
        }
    }

    async loadData() {
        // if (!window.foodRushApp) return;
        // Хэрэглэгчийн мэдээлэл байгаа эсэхийг шалгаад update
        if (window.foodRushApp && window.foodRushApp.currentUser) {
            this.updateAddressDisplay();
        } else {
            const currentAddress = this.shadowRoot.getElementById('current-address');
            currentAddress.textContent = 'Set your delivery address';
        }

        // Load current user address
        this.updateAddressDisplay();
        
        // Load categories
        this.renderCategories();
        
        // Load food items
        this.renderFoodItems();
        
        // Hide loading
        const loadingContainer = this.shadowRoot.getElementById('loading-container');
        if (loadingContainer) {
            loadingContainer.style.display = 'none';
        }
    }

    updateAddressDisplay() {
        const currentAddress = this.shadowRoot.getElementById('current-address');
        if (window.foodRushApp && window.foodRushApp.currentUser) {
            currentAddress.textContent = window.foodRushApp.currentUser.address || 'No address set';
        } else {
            currentAddress.textContent = 'Set your delivery address';
        }
    } 

    updateAddress(newAddress) {
        if (window.foodRushApp.currentUser) {
            window.foodRushApp.currentUser.address = newAddress;
            localStorage.setItem('user', JSON.stringify(window.foodRushApp.currentUser));
            this.updateAddressDisplay();
            
            if (window.foodRushApp) {
                window.foodRushApp.showNotification('Address updated successfully!', 'success');
            }
        }
    }

    renderCategories() { 
        const categoriesContainer = this.shadowRoot.getElementById('categories-container');
        if (!window.foodRushApp || !categoriesContainer) return;

        const categories = window.foodRushApp.categories;

        // pill-г div ашиглан гаргаж байна, data-category-id attribute-тэй
        categoriesContainer.innerHTML = categories.map(category => `
            <div class="category-pill ${category.slug === this.currentCategory ? 'active' : ''}" 
                data-category-id="${category.id}"
                data-category-slug="${category.slug}">
                <span class="category-icon ${category.icon.toLowerCase()}"></span>
                ${category.name}
            </div>
        `).join('');

        // click listener-г shadow DOM-д зөвхөн pill-д нэмнэ
        const categoryPills = categoriesContainer.querySelectorAll('.category-pill');
        categoryPills.forEach(pill => {
            pill.addEventListener('click', () => {
                const categorySlug = pill.dataset.categorySlug; 
                this.setActiveCategory(categorySlug);
            });
        });
    }
    updateActiveCategory(selectedCategoryId) {
        const pills = this.querySelectorAll('category-pill');

        pills.forEach(pill => {
            pill.setActive(
                pill.getAttribute('category-id') === selectedCategoryId
            );
        });
    }
    updateActivePills() {
        this.querySelectorAll('category-pill').forEach(pill => {
            pill.toggleAttribute(
                'active',
                pill.getAttribute('category-id') === this.currentCategory
            );
        });
    }

    setActiveCategory(categoryId) { 
        this.currentCategory = categoryId;

        // shadow DOM доторх pill-үүдийн class update
        const categoryPills = this.shadowRoot.querySelectorAll('.category-pill');
        categoryPills.forEach(pill => {
            if (pill.getAttribute('data-category-id') === categoryId) {
                pill.classList.add('active');
            } else {
                pill.classList.remove('active');
            }
        });

        // хоолны grid-г filter хийнэ
        this.filterFoods();
    }

    renderFoodItems(foods = null) {
        const foodGrid = this.shadowRoot.getElementById('food-grid');
        const emptyState = this.shadowRoot.getElementById('empty-state');
        
        if (!window.foodRushApp || !foodGrid) return;

        const foodItems = foods || window.foodRushApp.foodItems;
        
        if (foodItems.length === 0) {
            foodGrid.innerHTML = '';
            emptyState.classList.remove('hidden');
            return;
        }

        emptyState.classList.add('hidden');
        
        foodGrid.innerHTML = foodItems.map(food => `
            <div class="food-card" data-food-id="${food.id}">
                <img src="${food.image}" alt="${food.name}" class="food-image" loading="lazy">
                <div class="food-info">
                    <div class="food-header">
                        <div>
                            <h3 class="food-name">${food.name}</h3>
                            <p class="food-restaurant">${food.restaurant}</p>
                        </div>
                        <div class="food-price">$${food.price.toFixed(2)}</div>
                    </div>
                    <p class="food-description">${food.description}</p>
                    <div class="food-footer">
                        <div class="food-rating">
                            <span class="rating-stars">★★★★★</span>
                            <span>${food.rating}</span>
                            <span>• ${food.deliveryTime}</span>
                        </div>
                        <div class="food-actions">
                            <button class="action-btn save-btn ${window.foodRushApp && window.foodRushApp.isItemSaved(food.id) ? 'saved' : ''}" 
                                    data-food-id="${food.id}" data-action="save">
                                ❤️
                            </button>
                            <button class="action-btn cart-btn" data-food-id="${food.id}" data-action="add-to-cart">
                                🛒
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        // Add click listeners for food card actions
        this.setupFoodCardListeners();
    }

    setupFoodCardListeners() {
        const foodGrid = this.shadowRoot.getElementById('food-grid');
        
        foodGrid.addEventListener('click', (e) => {
            const button = e.target.closest('.action-btn');
            if (!button) return;
            
            const foodId = button.dataset.foodId;
            const action = button.dataset.action;
            
            if (action === 'save') {
                this.toggleSaveFood(foodId, button);
            } else if (action === 'add-to-cart') {
                this.addToCart(foodId);
            }
        });
    }

    toggleSaveFood(foodId, button) {
        if (!window.foodRushApp) return;
        
        const isSaved = window.foodRushApp.toggleSaveItem(foodId);
        
        if (isSaved) {
            button.classList.add('saved');
        } else {
            button.classList.remove('saved');
        }
    }

    addToCart(foodId) {
        if (!window.foodRushApp) return;
        
        const success = window.foodRushApp.addToCart(foodId);
        
        if (success) {
            // Add visual feedback
            const button = this.shadowRoot.querySelector(`[data-food-id="${foodId}"][data-action="add-to-cart"]`);
            if (button) {
                button.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    button.style.transform = 'scale(1)';
                }, 200);
            }
        }
    }
    toggleTheme() {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
        this.setAttribute('theme', this.theme);
    }
    

    async filterFoods() {
        if (!window.foodRushApp) return;

        let filteredFoods = window.foodRushApp.foodItems;

        try {
            // Filter by category
            if (this.currentCategory && this.currentCategory !== 'all') {
                filteredFoods = filteredFoods.filter(food => {
                    // food.categoryId байхгүй бол category талбарыг ашиглана
                    // const foodCategory = food.categoryId || food.category; // categoryId байхгүй бол category field
                    // return foodCategory === this.currentCategory;
                    return food.category.toLowerCase() === this.currentCategory.toLowerCase();
                });
            }else {
                // all category → бүх хоолыг харуулна
                filteredFoods = window.foodRushApp.foodItems;
            }

            // Filter by search query
            if (this.searchQuery.trim()) {
                const query = this.searchQuery.trim().toLowerCase();
                filteredFoods = filteredFoods.filter(food =>
                    food.name.toLowerCase().includes(query) ||
                    food.description.toLowerCase().includes(query) ||
                    food.restaurant.toLowerCase().includes(query)
                );
            }

            this.renderFoodItems(filteredFoods);

        } catch (error) {
            console.error('[HomePage Error] filterFoods:', error);
        }
    }


}

// Register the component
customElements.define('home-page', HomePage);