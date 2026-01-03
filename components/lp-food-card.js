class FoodCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.food = null;
        this.render();
    }

    static get observedAttributes() {
        return ['food-id', 'name', 'price', 'image', 'description', 'restaurant', 'rating'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.updateFoodData();
            this.render();
        }
    }

    updateFoodData() {
        this.food = {
            id: this.getAttribute('food-id'),
            name: this.getAttribute('name'),
            price: parseFloat(this.getAttribute('price')),
            image: this.getAttribute('image'),
            description: this.getAttribute('description'),
            restaurant: this.getAttribute('restaurant'),
            rating: parseFloat(this.getAttribute('rating'))
        };
    }

    render() {
      this.shadowRoot.innerHTML = /*css */ `
            <style>
                :host {
                    --bg-primary: #0A0A0A;
                    --bg-secondary: #1A1A1A;
                    --accent-primary: #00D4FF;
                    --accent-secondary: #FF006B;
                    --text-primary: #FFFFFF;
                    --text-secondary: #B0B0B0;
                    --font-body: 'Inter', sans-serif;
                    --font-mono: 'JetBrains Mono', monospace;
                }

                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                .food-card {
                    background: rgba(26, 26, 26, 0.8);
                    border: 1px solid rgba(0, 212, 255, 0.1);
                    border-radius: 12px;
                    overflow: hidden;
                    transition: all 0.3s ease;
                    cursor: pointer;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
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
                    flex: 1;
                    display: flex;
                    flex-direction: column;
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
                    flex: 1;
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

                .cart-btn.added {
                    background: #2ed573;
                    animation: addedPulse 0.3s ease-out;
                }

                @keyframes addedPulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.2); }
                    100% { transform: scale(1); }
                }
            </style>
            
            <div class="food-card">
                <img class="food-image" id="food-image" src="" alt="Food Item">
                <div class="food-info">
                    <div class="food-header">
                        <div>
                            <h3 class="food-name" id="food-name">Food Name</h3>
                            <p class="food-restaurant" id="food-restaurant">Restaurant Name</p>
                        </div>
                        <div class="food-price" id="food-price">$0.00</div>
                    </div>
                    <p class="food-description" id="food-description">Food description goes here.</p>
                    <div class="food-footer">
                        <div class="food-rating">
                            <span class="rating-stars">★★★★★</span>
                            <span id="food-rating">0.0</span>
                        </div>
                        <div class="food-actions">
                            <button class="action-btn save-btn" id="save-btn">❤️</button>
                            <button class="action-btn cart-btn" id="cart-btn">🛒</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.setupEventListeners();
        this.updateFoodData();
        this.updateDisplay();
    }

    setupEventListeners() {
        const saveBtn = this.shadowRoot.getElementById('save-btn');
        const cartBtn = this.shadowRoot.getElementById('cart-btn');

        saveBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleSave();
        });

        cartBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.addToCart();
        });

        this.shadowRoot.querySelector('.food-card').addEventListener('click', () => {
            this.showFoodDetails();
        });
    }

    updateDisplay() {
        if (!this.food) return;

        this.shadowRoot.getElementById('food-image').src = this.food.image_url;
        this.shadowRoot.getElementById('food-name').textContent = this.food.name;
        this.shadowRoot.getElementById('food-restaurant').textContent = this.food.restaurant;
        this.shadowRoot.getElementById('food-price').textContent = `$${this.food.price.toFixed(2)}`;
        this.shadowRoot.getElementById('food-description').textContent = this.food.description;
        this.shadowRoot.getElementById('food-rating').textContent = this.food.rating.toFixed(1);

        // Update save button state
        this.updateSaveButton();
    }

    updateSaveButton() {
        if (!window.foodRushApp || !this.food) return;

        const saveBtn = this.shadowRoot.getElementById('save-btn');
        const isSaved = window.foodRushApp.isItemSaved(this.food.id);

        if (isSaved) {
            saveBtn.classList.add('saved');
        } else {
            saveBtn.classList.remove('saved');
        }
    }

    toggleSave() {
        if (!window.foodRushApp || !this.food) return;

        const isSaved = window.foodRushApp.toggleSaveItem(this.food.id);
        this.updateSaveButton();

        // Show notification
        if (window.foodRushApp) {
            const message = isSaved ? 'Added to saved foods!' : 'Removed from saved foods';
            window.foodRushApp.showNotification(message, isSaved ? 'success' : 'info');
        }
    }

    addToCart() {
        if (!window.foodRushApp || !this.food) return;

        const success = window.foodRushApp.addToCart(this.food.id);

        if (success) {
            const cartBtn = this.shadowRoot.getElementById('cart-btn');
            cartBtn.classList.add('added');
            
            setTimeout(() => {
                cartBtn.classList.remove('added');
            }, 1000);
        }
    }

    showFoodDetails() {
        if (!window.foodRushApp || !this.food) return;

        // For now, just show a notification
        // In a full implementation, this could open a detailed view modal
        if (window.foodRushApp) {
            window.foodRushApp.showNotification(`Viewing details for ${this.food.name}`, 'info');
        }
    }
}

// Register the component
customElements.define('food-card', FoodCard);