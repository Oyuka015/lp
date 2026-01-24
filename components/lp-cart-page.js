class CartPage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = /*css */ `
            <style>
                :host {
                    --bg-primary: #0A0A0A;
                    --bg-secondary: #1A1A1A;
                    --accent-primary: hsl(25, 100%, 50%);
                    --accent-secondary: #FF006B;
                    --text-primary: #FFFFFF;
                    --text-secondary: #B0B0B0;
                    --font-display: 'Orbitron', monospace;
                    --font-body: 'Inter', sans-serif;
                    --font-mono: 'JetBrains Mono', monospace;
                }

                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                .cart-container {
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

                .cart-count {
                    color: var(--accent-primary);
                    font-weight: 600;
                }

                /* Cart Items */
                .cart-items {
                    margin-bottom: 24px;
                }

                .cart-item {
                    display: flex;
                    background: rgba(26, 26, 26, 0.8);
                    border: 1px solid rgba(0, 212, 255, 0.1);
                    border-radius: 12px;
                    padding: 16px;
                    margin-bottom: 16px;
                    transition: all 0.3s ease;
                }

                .cart-item:hover {
                    border-color: var(--accent-primary);
                    box-shadow: 0 4px 20px rgba(0, 212, 255, 0.1);
                }

                .item-image {
                    width: 80px;
                    height: 80px;
                    border-radius: 8px;
                    object-fit: cover;
                    margin-right: 16px;
                    flex-shrink: 0;
                }

                .item-details {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                }

                .item-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 8px;
                }

                .item-name {
                    font-size: 16px;
                    font-weight: 600;
                    color: var(--text-primary);
                    margin-bottom: 4px;
                }

                .item-price {
                    font-family: var(--font-mono);
                    font-size: 18px;
                    font-weight: 700;
                    color: var(--accent-primary);
                }

                .item-description {
                    font-size: 14px;
                    color: var(--text-secondary);
                    margin-bottom: 12px;
                    line-height: 1.4;
                }

                .item-controls {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .quantity-controls {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .quantity-btn {
                    width: 32px;
                    height: 32px;
                    border: 2px solid var(--accent-primary);
                    background: transparent;
                    color: var(--accent-primary);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-weight: 600;
                }

                .quantity-btn:hover {
                    background: var(--accent-primary);
                    color: var(--bg-primary);
                    transform: scale(1.1);
                }

                .quantity-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .quantity-display {
                    font-family: var(--font-mono);
                    font-size: 16px;
                    font-weight: 600;
                    color: var(--text-primary);
                    min-width: 30px;
                    text-align: center;
                }

                .remove-btn {
                    background: rgba(255, 0, 107, 0.1);
                    border: 1px solid rgba(255, 0, 107, 0.3);
                    color: var(--accent-secondary);
                    padding: 8px 12px;
                    border-radius: 6px;
                    font-size: 12px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .remove-btn:hover {
                    background: var(--accent-secondary);
                    color: var(--text-primary);
                    transform: scale(1.05);
                }

                /* Order Summary */
                .order-summary {
                    background: rgba(26, 26, 26, 0.8);
                    border: 1px solid rgba(0, 212, 255, 0.2);
                    border-radius: 16px;
                    padding: 24px;
                    margin-bottom: 24px;
                    position: sticky;
                    top: 20px;
                }

                .summary-title {
                    font-family: var(--font-display);
                    font-size: 20px;
                    font-weight: 700;
                    color: var(--text-primary);
                    margin-bottom: 20px;
                    text-align: center;
                }

                .summary-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 12px;
                    font-size: 14px;
                }

                .summary-label {
                    color: var(--text-secondary);
                }

                .summary-value {
                    font-family: var(--font-mono);
                    color: var(--text-primary);
                    font-weight: 500;
                }

                .summary-divider {
                    height: 1px;
                    background: rgba(0, 212, 255, 0.2);
                    margin: 16px 0;
                }

                .summary-total {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: 18px;
                    font-weight: 700;
                }

                .total-label {
                    color: var(--text-primary);
                    font-family: var(--font-display);
                }

                .total-value {
                    font-family: var(--font-mono);
                    color: var(--accent-primary);
                    font-size: 24px;
                }

                /* Checkout Button */
                .checkout-section {
                    text-align: center;
                }

                .checkout-btn {
                    width: 100%;
                    max-width: 400px;
                    background: var(--accent-primary) ;
                    border: none;
                    color: var(--text-primary);
                    padding: 16px 32px;
                    border-radius: 12px;
                    font-family: var(--font-display);
                    font-size: 18px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    margin-bottom: 16px;
                }

                .checkout-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 30px rgba(0, 212, 255, 0.4);
                }

                .checkout-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    transform: none;
                    box-shadow: none;
                }

                .continue-shopping {
                    color: var(--accent-primary);
                    text-decoration: none;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .continue-shopping:hover {
                    text-decoration: underline;
                    text-shadow: 0 0 10px var(--accent-primary);
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
                    animation: bounce 2s ease-in-out infinite;
                }

                @keyframes bounce {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-15px); }
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

                .shop-btn {
                    background: var(--accent-primary) ;
                    color: var(--text-primary);
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .shop-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(0, 212, 255, 0.4);
                }

                /* Payment Modal */
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
                    text-align: center;
                }

                .modal-icon {
                    font-size: 48px;
                    margin-bottom: 16px;
                    animation: successPulse 2s ease-in-out infinite;
                }

                @keyframes successPulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                }

                .modal-title {
                    font-family: var(--font-display);
                    font-size: 20px;
                    font-weight: 700;
                    color: var(--text-primary);
                    margin-bottom: 8px;
                }

                .modal-text {
                    font-size: 16px;
                    color: var(--text-secondary);
                    margin-bottom: 20px;
                }

                .modal-btn {
                    background: var(--accent-primary);
                    color: var(--text-primary);
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .modal-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(0, 212, 255, 0.4);
                }

                @media (max-width: 768px) {
                    .cart-container {
                        padding: 16px 12px 80px;
                    }
                    
                    .cart-item {
                        flex-direction: column;
                        align-items: flex-start;
                    }
                    
                    .item-image {
                        width: 100%;
                        height: 120px;
                        margin-right: 0;
                        margin-bottom: 12px;
                    }
                    
                    .page-title {
                        font-size: 28px;
                    }
                    
                    .order-summary {
                        position: static;
                    }
                }

                @media (max-width: 480px) {
                    .item-controls {
                        flex-direction: column;
                        gap: 12px;
                        align-items: flex-start;
                    }
                    
                    .quantity-controls {
                        align-self: stretch;
                        justify-content: center;
                    }
                }
            </style>
            
            <div class="cart-container">
                <div class="page-header">
                    <h1 class="page-title">Сагс</h1>
                    <p class="page-subtitle">
                        Таны сагсалсан бүтээгдэхүүнүүд
                        <span class="cart-count" id="cart-count">(0 бүтээгдэхүүн)</span>
                    </p>
                </div>
                
                <!-- Cart Items -->
                <div class="cart-items" id="cart-items">
                    <!--  end orj irne -->
                </div>
                
                <!-- Order Summary -->
                <div class="order-summary" id="order-summary">
                    <h3 class="summary-title">Захиалгын хураангуй</h3>
                    
                    <div class="summary-row">
                        <span class="summary-label">Төлбөр:</span>
                        <span class="summary-value" id="subtotal">₮0.00</span>
                    </div>
                    
                    <div class="summary-row">
                        <span class="summary-label">Хүргэлтийн төлбөр:</span>
                        <span class="summary-value" id="delivery-fee">₮5000</span>
                    </div>
                    
                    <div class="summary-row">
                        <span class="summary-label">НӨАТ:</span>
                        <span class="summary-value" id="tax">₮0.00</span>
                    </div>
                    
                    <div class="summary-divider"></div>
                    
                    <div class="summary-total">
                        <span class="total-label">Нийт:</span>
                        <span class="total-value" id="total-amount">₮0.00</span>
                    </div>
                </div>
                
                <!-- Checkout Section -->
                <div class="checkout-section">
                    <button class="checkout-btn" id="checkout-btn">
                        Захиалах
                    </button>
                    <a href="#home" class="continue-shopping" id="continue-shopping">Өөр бүтээгдэхүүн нэмэх</a>
                </div>
                
                <!-- Empty State -->
                <div class="empty-state hidden" id="empty-state">
                    <div class="empty-icon">🛒</div>
                    <h3 class="empty-title">Таны сагс хоосон байна.</h3>
                    <p class="empty-text">Нүүр хуудаснаас нэмнэ үү.</p>
                    <button class="shop-btn" id="shop-btn">Эхлэх</button>
                </div>
            </div>
            
            <!-- Payment Success Modal -->
            <div class="modal-overlay" id="payment-modal">
                <div class="modal-content">
                    <div class="modal-icon">✅</div>
                    <h3 class="modal-title">Захиалга амжилттай баталгаажлаа</h3>
                    <p class="modal-text">Хүргэлт удахгүй очино.</p>
                    <button class="modal-btn" id="close-modal">Үргэлжлүүлэх</button>
                </div>
            </div>
        `;
  }

  connectedCallback() {
    this.loadCartItems();
    this.setupEventListeners();
  }

  setupEventListeners() {
    const checkoutBtn = this.shadowRoot.getElementById("checkout-btn");
    const continueShopping =
      this.shadowRoot.getElementById("continue-shopping");
    const shopBtn = this.shadowRoot.getElementById("shop-btn");
    const closeModal = this.shadowRoot.getElementById("close-modal");
    const paymentModal = this.shadowRoot.getElementById("payment-modal");

    checkoutBtn.addEventListener("click", () => {
      this.processCheckout();
    });

    continueShopping.addEventListener("click", (e) => {
      e.preventDefault();
      if (window.foodRushApp) {
        window.foodRushApp.navigateTo("home");
      }
    });

    shopBtn.addEventListener("click", () => {
      if (window.foodRushApp) {
        window.foodRushApp.navigateTo("home");
      }
    });

    closeModal.addEventListener("click", () => {
      paymentModal.classList.remove("show");
    });

    paymentModal.addEventListener("click", (e) => {
      if (e.target === paymentModal) {
        paymentModal.classList.remove("show");
      }
    });

    this.setupCartItemListeners();
  }

  setupCartItemListeners() {
    const cartItems = this.shadowRoot.getElementById("cart-items");

    cartItems.addEventListener("click", (e) => {
      const button = e.target.closest(".quantity-btn, .remove-btn");
      if (!button) return;

      const cartItem = button.closest(".cart-item");
      const foodId = cartItem.dataset.foodId;

      if (button.classList.contains("quantity-btn")) {
        const action = button.dataset.action;
        this.updateQuantity(foodId, action);
      } else if (button.classList.contains("remove-btn")) {
        this.removeFromCart(foodId);
      }
    });
  }

  async loadCartItems() {
    if (!window.foodRushApp) return;

    await window.foodRushApp.syncCartFromServer();

    const cartItems = window.foodRushApp.cart;
    const cartItemsContainer = this.shadowRoot.getElementById("cart-items");
    const orderSummary = this.shadowRoot.getElementById("order-summary");
    const checkoutSection = this.shadowRoot.querySelector(".checkout-section");
    const emptyState = this.shadowRoot.getElementById("empty-state");
    const cartCount = this.shadowRoot.getElementById("cart-count");

    const itemCount = window.foodRushApp.getCartItemCount();
    cartCount.textContent = `(${itemCount} бүтээгдэхүүн${
      itemCount !== 1 ? "s" : ""
    })`;

    if (cartItems.length === 0) {
      cartItemsContainer.innerHTML = "";
      orderSummary.style.display = "none";
      checkoutSection.style.display = "none";
      emptyState.classList.remove("hidden");
      return;
    }

    emptyState.classList.add("hidden");
    orderSummary.style.display = "block";
    checkoutSection.style.display = "block";

    cartItemsContainer.innerHTML = cartItems
      .map((item) => {
        const food = window.foodRushApp.foodItems.find(
          (f) => f.id === item.foodId
        );
        return `
                <div class="cart-item" data-food-id="${item.foodId}">
                    <img src="${item.image}" alt="${
          item.name
        }" class="item-image" loading="lazy" decoding="async">
                    <div class="item-details">
                        <div class="item-header">
                            <h3 class="item-name">${item.name}</h3>
                            <div class="item-price">₮${(
                              item.price * item.quantity
                            ).toFixed(2)}</div>
                        </div>
                        <p class="item-description">${
                          food ? food.description : "Delicious food item"
                        }</p>
                        <div class="item-controls">
                            <div class="quantity-controls">
                                <button class="quantity-btn" data-action="decrease">−</button>
                                <span class="quantity-display">${
                                  item.quantity
                                }</span>
                                <button class="quantity-btn" data-action="increase">+</button>
                            </div>
                            <button class="remove-btn">Арилгах</button>
                        </div>
                    </div>
                </div>
            `;
      })
      .join("");

    this.updateOrderSummary();
  }

  updateQuantity(foodId, action) {
    if (!window.foodRushApp) return;

    const item = window.foodRushApp.cart.find((item) => item.foodId === foodId);
    if (!item) return;

    let newQuantity = item.quantity;

    if (action === "increase") {
      newQuantity++;
    } else if (action === "decrease") {
      newQuantity--;
    }

    window.foodRushApp.updateCartQuantity(foodId, newQuantity);
    this.loadCartItems();
  }

  removeFromCart(foodId) {
    if (!window.foodRushApp) return;

    window.foodRushApp.removeFromCart(foodId);

    if (window.foodRushApp) {
      window.foodRushApp.showNotification("Сагснаас хасагдлаа", "info");
    }

    this.loadCartItems();
  }

  updateOrderSummary() {
    if (!window.foodRushApp) return;

    const subtotal = window.foodRushApp.getCartTotal();
    const deliveryFee = subtotal > 0 ? 5000 : 0;
    const tax = subtotal * 0.08;
    const total = subtotal + deliveryFee + tax;

    this.shadowRoot.getElementById(
      "subtotal"
    ).textContent = `₮${subtotal.toFixed(2)}`;
    this.shadowRoot.getElementById(
      "delivery-fee"
    ).textContent = `₮${deliveryFee.toFixed(2)}`;
    this.shadowRoot.getElementById("tax").textContent = `₮${tax.toFixed(2)}`;
    this.shadowRoot.getElementById(
      "total-amount"
    ).textContent = `₮${total.toFixed(2)}`;

    const checkoutBtn = this.shadowRoot.getElementById("checkout-btn");
    checkoutBtn.disabled = subtotal === 0;
  }

  async processCheckout() {
    const checkoutBtn = this.shadowRoot.getElementById("checkout-btn");

    if (!window.foodRushApp || window.foodRushApp.cart.length === 0) {
      return;
    }

    checkoutBtn.innerHTML = "Уншиж байна...";
    checkoutBtn.disabled = true;

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const success = window.foodRushApp.checkout();

    if (success) {
      const paymentModal = this.shadowRoot.getElementById("payment-modal");
      paymentModal.classList.add("show");

      this.loadCartItems();
    }

    checkoutBtn.innerHTML = "Захиалах";
    checkoutBtn.disabled = false;
  }

  refresh() {
    this.loadCartItems();
  }
}

customElements.define("cart-page", CartPage);
