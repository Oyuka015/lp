class OrderPage extends HTMLElement {
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

                * { margin: 0; padding: 0; box-sizing: border-box; }

                .container {
                    min-height: 100vh;
                    padding: 20px 16px 80px;
                    color: var(--text-primary);
                    font-family: var(--font-body);
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
                    text-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
                }

                .page-subtitle {
                    font-size: 16px;
                    color: var(--text-secondary);
                }

                .orders-list {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                .order-card {
                    background: rgba(26, 26, 26, 0.8);
                    border: 1px solid rgba(0, 212, 255, 0.2);
                    border-radius: 16px;
                    padding: 20px;
                    transition: all 0.3s ease;
                }

                .order-card:hover {
                    box-shadow: 0 8px 25px rgba(0, 212, 255, 0.2);
                }

                .order-header {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 12px;
                }

                .order-id {
                    font-family: var(--font-display);
                    font-weight: 700;
                    font-size: 16px;
                    color: var(--accent-primary);
                }

                .order-date {
                    font-size: 14px;
                    color: var(--text-secondary);
                }

                .order-items {
                    margin-top: 8px;
                    border-top: 1px solid rgba(255,255,255,0.1);
                    padding-top: 8px;
                }

                .order-item {
                    display: flex;
                    justify-content: space-between;
                    padding: 4px 0;
                    font-size: 14px;
                }

                .order-total {
                    margin-top: 12px;
                    text-align: right;
                    font-weight: 700;
                    font-size: 16px;
                    color: var(--accent-secondary);
                }

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
            </style>

            <div class="container"> 
            
                <!--<button id="back-btn" style="
                    margin-bottom: 16px;
                    padding: 8px 16px;
                    border-radius: 8px;
                    cursor: pointer;
                ">← Back to Profile</button>-->

                <div class="page-header">
                    <h1 class="page-title">Order History</h1>
                    <p class="page-subtitle">View your previous orders</p>
                </div>

                <div class="loading-container" id="loading-container">
                    <div class="loading-spinner"></div>
                </div>

                <div class="orders-list" id="orders-list"></div>
            </div>
        `;
    }

    connectedCallback() {
        this.loadOrders();
        this.setupEventListeners();
    }

    setupEventListeners() {
        const orderList = this.shadowRoot.getElementById('orders-list');
        // Back button
        // const backBtn = this.shadowRoot.getElementById('back-btn');

        // if (backBtn) {
        //     backBtn.addEventListener('click', (e) => {
        //         e.preventDefault();
        //         const page = backBtn.dataset.page;

        //         if (window.foodRushApp) {
        //             window.foodRushApp.navigateTo(page);
        //         }
        //     });
        // }

        // Order actions
        orderList.addEventListener('click', async (e) => {
            const button = e.target.closest('.action-btn');
            if (!button) return;

            const orderId = button.dataset.orderId;
            const action = button.dataset.action;

            if (action === 'cancel') {
                const confirmed = confirm('Are you sure you want to cancel this order?');
                if (confirmed) {
                    await window.apiClient.cancelOrder(orderId);
                    this.loadOrders();
                }
            } else if (action === 'view') {
                // Show order details (modal or navigate)
                alert(`View details for order #${orderId}`);
            }
        });
    }


    async loadOrders() {
        const loadingContainer = this.shadowRoot.getElementById('loading-container');
        const orderList = this.shadowRoot.getElementById('orders-list');
        const emptyState = this.shadowRoot.getElementById('empty-state') || document.createElement('div');

        loadingContainer.style.display = 'flex';
        orderList.style.display = 'none';
        emptyState.classList.add('hidden');

        try {
            const result = await window.apiClient.getOrders();
            const orders = result.success ? result.data : [];

            loadingContainer.style.display = 'none';

            if (orders.length === 0) {
                orderList.style.display = 'none';
                emptyState.classList.remove('hidden');
                return;
            }

            orderList.style.display = 'flex';
            emptyState.classList.add('hidden');

            orderList.innerHTML = orders.map(order => `
                <div class="order-card">
                    <div class="order-header">
                        <span class="order-number">#${order.orderNumber}</span>
                        <span class="order-status">${order.status}</span>
                    </div>
                    <div>Total: $${order.totalAmount.toFixed(2)}</div>
                    <div>Items: ${order.itemCount}</div>

                    <!-- Захиалгын доторх хоолнууд -->
                    <div class="order-items">
                        ${order.items.map(item => `
                            <div class="order-item">
                                <span>${item.name} x ${item.quantity}</span>
                                <span>$${parseFloat(item.subtotal).toFixed(2)}</span>
                            </div>
                        `).join('')}
                    </div>

                    <div class="order-footer">
                        ${order.status === 'pending' ? `<button class="action-btn cancel-btn" data-order-id="${order.id}" data-action="cancel">Cancel</button>` : ''}
                    </div>
                </div>
            `).join('');


        } catch (err) {
            console.error('Failed to load orders', err);
            loadingContainer.textContent = 'Failed to load orders';
        }
    }

    refresh() {
        this.loadOrders();
    }

} 

window.customElements.define('order-page', OrderPage);