// Navigation Component for FoodRush App
class AppNav extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
        this.setupEventListeners();
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

                .nav-container {
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    background: rgba(10, 10, 10, 0.95);
                    backdrop-filter: blur(10px);
                    border-top: 1px solid rgba(0, 212, 255, 0.2);
                    z-index: 1000;
                    padding: 8px 0 max(8px, env(safe-area-inset-bottom));
                }

                .nav-items {
                    display: flex;
                    justify-content: space-around;
                    align-items: center;
                    max-width: 500px;
                    margin: 0 auto;
                    padding: 0 16px;
                }

                .nav-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 8px 12px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    position: relative;
                    text-decoration: none;
                    color: var(--text-secondary);
                }

                .nav-item:hover {
                    color: var(--accent-primary);
                    transform: translateY(-2px);
                }

                .nav-item.active {
                    color: var(--accent-primary);
                }

                .nav-item.active .nav-icon {
                    filter: drop-shadow(0 0 8px var(--accent-primary));
                }

                .nav-item.active::after {
                    content: '';
                    position: absolute;
                    top: -8px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 4px;
                    height: 4px;
                    background: var(--accent-primary);
                    border-radius: 50%;
                    box-shadow: 0 0 10px var(--accent-primary);
                    animation: pulse 2s infinite;
                }

                @keyframes pulse {
                    0%, 100% { opacity: 1; transform: translateX(-50%) scale(1); }
                    50% { opacity: 0.7; transform: translateX(-50%) scale(1.5); }
                }

                .nav-icon {
                    width: 24px;
                    height: 24px;
                    margin-bottom: 4px;
                    transition: all 0.3s ease;
                }

                .nav-label {
                    font-size: 12px;
                    font-weight: 500;
                    font-family: var(--font-body);
                    text-align: center;
                }

                .cart-counter {
                    position: absolute;
                    top: 4px;
                    right: 4px;
                    background: var(--accent-secondary);
                    color: white;
                    border-radius: 50%;
                    width: 18px;
                    height: 18px;
                    font-size: 10px;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: var(--font-mono);
                    animation: none;
                }

                .cart-counter.show {
                    display: flex;
                }

                .cart-counter.pulse {
                    animation: cartPulse 0.3s ease-out;
                }

                @keyframes cartPulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.3); }
                    100% { transform: scale(1); }
                }

                /* SVG Icons */
                .icon-home {
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='white' viewBox='0 0 24 24'%3E%3Cpath d='M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z'/%3E%3C/svg%3E");
                }

                .icon-saved {
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='white' viewBox='0 0 24 24'%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/%3E%3C/svg%3E");
                }

                .icon-cart {
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='white' viewBox='0 0 24 24'%3E%3Cpath d='M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z'/%3E%3C/svg%3E");
                }

                .icon-profile {
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='white' viewBox='0 0 24 24'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E");
                }

                .icon-login {
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='white' viewBox='0 0 24 24'%3E%3Cpath d='M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z'/%3E%3C/svg%3E");
                }

                /* Responsive Design */
                @media (max-width: 480px) {
                    .nav-item {
                        padding: 6px 8px;
                    }
                    
                    .nav-icon {
                        width: 22px;
                        height: 22px;
                    }
                    
                    .nav-label {
                        font-size: 11px;
                    }
                }
            </style>
            
            <nav class="nav-container">
                <div class="nav-items">
                    <a href="#home" class="nav-item" data-page="home">
                        <div class="nav-icon icon-home"></div>
                        <span class="nav-label">Home</span>
                    </a>
                    
                    <a href="#saved" class="nav-item" data-page="saved">
                        <div class="nav-icon icon-saved"></div>
                        <span class="nav-label">Saved</span>
                    </a>
                    
                    <a href="#cart" class="nav-item" data-page="cart">
                        <div class="nav-icon icon-cart"></div>
                        <span class="nav-label">Cart</span>
                        <span class="cart-counter" style="display: none;">0</span>
                    </a>
                    
                    <a href="#profile" class="nav-item" data-page="profile">
                        <div class="nav-icon icon-profile"></div>
                        <span class="nav-label">Profile</span>
                    </a>
                </div>
            </nav>
        `;
    }

    setupEventListeners() {
        const navItems = this.shadowRoot.querySelectorAll('.nav-item');
        // const navItems = document.querySelectorAll('.nav-item');
        
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = item.dataset.page;
                
                if (window.foodRushApp) {
                    window.foodRushApp.navigateTo(page);
                }
            });
        });
    }

    updateCartCounter(count) {
        const counter = this.shadowRoot.querySelector('.cart-counter');
        if (counter) {
            counter.textContent = count;
            counter.style.display = count > 0 ? 'flex' : 'none';
            
            if (count > 0) {
                counter.classList.add('pulse');
                setTimeout(() => counter.classList.remove('pulse'), 300);
            }
        }
    }

    setActivePage(page) {
        const navItems = this.shadowRoot.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            if (item.dataset.page === page) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }
}

// Register the component
customElements.define('app-nav', AppNav);