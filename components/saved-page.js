// Saved Page Component for FoodRush App
class SavedPage extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    --bg-primary: #0A0A0A;
                    --bg-secondary: #1A1A1A;
                    --accent-primary: #00D4FF;
                    --accent-secondary: #FF006B;
                    --text-primary: #FFFFFF;
                    --text-secondary: #B0B0B0;
                    --font-display: 'Orbitron', monospace;
                    --font-body: 'Inter', sans-serif;
                }

                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                .saved-container {
                    min-height: 100vh;
                    padding: 20px 16px 80px;
                }

                .page-header {
                    text-align: center;
                    margin-bottom: 32px;
                }

                .page-title {
                    font-family: var(--font-display);
                    font-size: 32px;
                    font-weight: 900;
                    color: var(--text-primary);
                    margin-bottom: 8px;
                    text-shadow: 0 0 30px rgba(0, 212, 255, 0.3);
                }

                .page-subtitle {
                    font-size: 16px;
                    color: var(--text-secondary);
                }

                .saved-count {
                    color: var(--accent-primary);
                    font-weight: 600;
                }

                /* Food Grid */
                .food-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 16px;
                }

                .food-card {
                    background: rgba(26, 26, 26, 0.8);
                    border: 1px solid rgba(255, 0, 107, 0.2);
                    border-radius: 12px;
                    overflow: hidden;
                    transition: all 0.3s ease;
                    cursor: pointer;
                    position: relative;
                }

                .food-card:hover {
                    transform: translateY(-4px);
                    border-color: var(--accent-secondary);
                    box-shadow: 0 8px 25px rgba(255, 0, 107, 0.2);
                }

                .saved-indicator {
                    position: absolute;
                    top: 8px;
                    right: 8px;
                    width: 32px;
                    height: 32px;
                    background: var(--accent-secondary);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 16px;
                    box-shadow: 0 2px 10px rgba(255, 0, 107, 0.4);
                    animation: pulse 2s infinite;
                }

                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.1); }
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
                    padding: 8px 16px;
                    border: none;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .remove-btn {
                    background: rgba(255, 0, 107, 0.1);
                    color: var(--accent-secondary);
                    border: 1px solid rgba(255, 0, 107, 0.3);
                }

                .remove-btn:hover {
                    background: var(--accent-secondary);
                    color: var(--text-primary);
                    transform: scale(1.05);
                }

                .cart-btn {
                    background: linear-gradient(135deg, var(--accent-primary), #0099CC);
                    color: var(--text-primary);
                }

                .cart-btn:hover {
                    transform: scale(1.05);
                    box-shadow: 0 4px 15px rgba(0, 212, 255, 0.4);
                }

                /* Empty State */
                .empty-state {
                    text-align: center;
                    padding: 80px 20px;
                    color: var(--text-secondary);
                }
                .empty-state.hidden {
                    display: none;
                }

                .empty-icon {
                    font-size: 64px;
                    margin-bottom: 24px;
                    opacity: 0.5;
                    animation: float 3s ease-in-out infinite;
                }

                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }

                .empty-title {
                    font-family: var(--font-display);
                    font-size: 24px;
                    font-weight: 700;
                    color: var(--text-primary);
                    margin-bottom: 8px;
                }

                .empty-text {
                    font-size: 16px;
                    margin-bottom: 24px;
                }

                .browse-btn {
                    background: linear-gradient(135deg, var(--accent-primary), #0099CC);
                    color: var(--text-primary);
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .browse-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(0, 212, 255, 0.4);
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
                    border: 3px solid rgba(255, 0, 107, 0.1);
                    border-radius: 50%;
                    border-top-color: var(--accent-secondary);
                    animation: spin 1s ease-in-out infinite;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                @media (max-width: 768px) {
                    .saved-container {
                        padding: 16px 12px 80px;
                    }
                    
                    .food-grid {
                        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                        gap: 12px;
                    }
                    
                    .page-title {
                        font-size: 28px;
                    }
                }

                @media (max-width: 480px) {
                    .food-grid {
                        grid-template-columns: 1fr;
                    }
                }
            </style>
            
            <div class="saved-container">
                <div class="page-header">
                    <h1 class="page-title">Saved Foods</h1>
                    <p class="page-subtitle">
                        Your favorite foods, ready to order anytime
                        <span class="saved-count" id="saved-count">(0)</span>
                    </p>
                </div>
                
                <div class="loading-container" id="loading-container">
                    <div class="loading-spinner"></div>
                </div>
                
                <div class="food-grid" id="food-grid">
                    <!-- Saved food items will be dynamically loaded -->
                </div>
                
                <div class="empty-state hidden" id="empty-state">
                    <div class="empty-icon">💾</div>
                    <h3 class="empty-title">No saved foods yet</h3>
                    <p class="empty-text">Start exploring and save your favorite foods for quick access</p>
                    <button class="browse-btn" id="browse-btn">Browse Foods</button>
                </div>
            </div>
        `;
    }

    connectedCallback() {
        this.loadSavedFoods();
        this.setupEventListeners();
    }

    setupEventListeners() {
        const browseBtn = this.shadowRoot.getElementById('browse-btn');
        const foodGrid = this.shadowRoot.getElementById('food-grid');
        
        browseBtn.addEventListener('click', () => {
            if (window.foodRushApp) {
                window.foodRushApp.navigateTo('home');
            }
        });

        // Add click listeners for food card actions
        foodGrid.addEventListener('click', async (e) => {
            const button = e.target.closest('.action-btn');
            if (!button) return;

            const foodId = button.dataset.foodId;
            const action = button.dataset.action;

            if (action === 'remove') {
                await window.foodRushApp.toggleSaveItem(foodId);
                this.loadSavedFoods(); // дахин render хийх
            } else if (action === 'add-to-cart') {
                window.foodRushApp.addToCart(foodId, 1);
            }
        });
    }

    async loadSavedFoods() {
        if (!window.foodRushApp) return;

        const loadingContainer = this.shadowRoot.getElementById('loading-container');
        const foodGrid = this.shadowRoot.getElementById('food-grid');
        const emptyState = this.shadowRoot.getElementById('empty-state');
        const savedCount = this.shadowRoot.getElementById('saved-count');

        // Show loading
        loadingContainer.style.display = 'flex';
        foodGrid.style.display = 'none';
        emptyState.classList.add('hidden');

        // Simulate loading delay
        const savedFoods = await window.foodRushApp.getSavedFoods();
        
        // Update count
        savedCount.textContent = `(${savedFoods.length})`;

        // Hide loading
        loadingContainer.style.display = 'none';

        if (savedFoods.length === 0) {
            foodGrid.style.display = 'none';
            emptyState.classList.remove('hidden');
            return;
        }

        // saved food байгаа үед
        emptyState.classList.add('hidden');
        foodGrid.style.display = 'grid';
        this.renderSavedFoods(savedFoods);
    }

    renderSavedFoods(foods) {
        const foodGrid = this.shadowRoot.getElementById('food-grid');
        
        foodGrid.innerHTML = foods.map(food => `
            <div class="food-card" data-food-id="${food.id}">
                <div class="saved-indicator">❤️</div>
                <img src="${food.image}" alt="${food.name}" class="food-image" loading="lazy">
                <div class="food-info">
                    <div class="food-header">
                        <div>
                            <h3 class="food-name">${food.name}</h3>
                            <p class="food-restaurant">${food.restaurant}</p>
                        </div>
                        <div class="food-price">$${food.price}</div>
                    </div>
                    <p class="food-description">${food.description}</p>
                    <div class="food-footer">
                        <div class="food-rating">
                            <span class="rating-stars">★★★★★</span>
                            <span>${food.rating}</span>
                            <span>• ${food.deliveryTime}</span>
                        </div>
                        <div class="food-actions">
                            <button class="action-btn remove-btn" data-food-id="${food.id}" data-action="remove">
                                Remove
                            </button>
                            <button class="action-btn cart-btn" data-food-id="${food.id}" data-action="add-to-cart">
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    removeFromSaved(foodId) {
        if (!window.foodRushApp) return;
        
        // Remove from saved items
        window.foodRushApp.toggleSaveItem(foodId);
        
        // Show notification
        if (window.foodRushApp) {
            window.foodRushApp.showNotification('Removed from saved foods', 'info');
        }
        
        // Reload the page to update the view
        this.loadSavedFoods();
    }

    addToCart(foodId) {
        if (!window.foodRushApp) return;
        
        const success = window.foodRushApp.addToCart(foodId);
        
        if (success) {
            // Add visual feedback
            const button = this.shadowRoot.querySelector(`[data-food-id="${foodId}"][data-action="add-to-cart"]`);
            if (button) {
                button.style.transform = 'scale(1.1)';
                button.textContent = 'Added!';
                setTimeout(() => {
                    button.style.transform = 'scale(1)';
                    button.textContent = 'Add to Cart';
                }, 1000);
            }
        }
    }

    // Method to refresh the page when returning from other pages
    refresh() {
        this.loadSavedFoods();
    }
}

// Register the component
customElements.define('saved-page', SavedPage);