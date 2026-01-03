// Profile Page Component for FoodRush App
class ProfilePage extends HTMLElement {
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

                .profile-container {
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

                /* Profile Card */
                .profile-card {
                    background: rgba(26, 26, 26, 0.8);
                    border: 1px solid rgba(0, 212, 255, 0.2);
                    border-radius: 16px;
                    padding: 24px;
                    margin-bottom: 24px;
                    text-align: center;
                }

                .profile-avatar {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 16px;
                    font-size: 32px;
                    color: var(--text-primary);
                    border: 3px solid rgba(0, 212, 255, 0.3);
                    box-shadow: 0 8px 30px rgba(0, 212, 255, 0.2);
                }

                .profile-name {
                    font-family: var(--font-display);
                    font-size: 24px;
                    font-weight: 700;
                    color: var(--text-primary);
                    margin-bottom: 8px;
                }

                .profile-email {
                    font-size: 16px;
                    color: var(--text-secondary);
                    margin-bottom: 16px;
                }

                .profile-stats {
                    display: flex;
                    justify-content: space-around;
                    margin-top: 20px;
                }

                .stat-item {
                    text-align: center;
                }

                .stat-value {
                    font-family: var(--font-mono);
                    font-size: 24px;
                    font-weight: 700;
                    color: var(--accent-primary);
                    display: block;
                }

                .stat-label {
                    font-size: 12px;
                    color: var(--text-secondary);
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                /* Info Sections */
                .info-section {
                    background: rgba(26, 26, 26, 0.6);
                    border: 1px solid rgba(0, 212, 255, 0.1);
                    border-radius: 12px;
                    padding: 20px;
                    margin-bottom: 16px;
                }

                .section-title {
                    font-family: var(--font-display);
                    font-size: 18px;
                    font-weight: 700;
                    color: var(--text-primary);
                    margin-bottom: 16px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .section-icon {
                    font-size: 20px;
                }

                .info-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 12px 0;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                }

                .info-item:last-child {
                    border-bottom: none;
                }

                .info-label {
                    font-size: 14px;
                    color: var(--text-secondary);
                }

                .info-value {
                    font-size: 14px;
                    color: var(--text-primary);
                    font-weight: 500;
                }

                .edit-btn {
                    background: rgba(0, 212, 255, 0.1);
                    border: 1px solid rgba(0, 212, 255, 0.3);
                    color: var(--accent-primary);
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 12px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .edit-btn:hover {
                    background: var(--accent-primary);
                    color: var(--bg-primary);
                }

                /* Action Buttons */
                .action-section {
                    margin-top: 32px;
                }

                .action-btn {
                    width: 100%;
                    padding: 16px;
                    border: none;
                    border-radius: 12px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    margin-bottom: 12px;
                }

                .logout-btn {
                    background: rgba(255, 0, 107, 0.1);
                    border: 2px solid var(--accent-secondary);
                    color: var(--accent-secondary);
                }

                .logout-btn:hover {
                    background: var(--accent-secondary);
                    color: var(--text-primary);
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(255, 0, 107, 0.3);
                }

                .orders-btn {
                    background: rgba(0, 212, 255, 0.1);
                    border: 2px solid var(--accent-primary);
                    color: var(--accent-primary);
                }

                .orders-btn:hover {
                    background: var(--accent-primary);
                    color: var(--text-primary);
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(0, 212, 255, 0.3);
                }

                .support-btn {
                    background: transparent;
                    border: 2px solid var(--text-secondary);
                    color: var(--text-secondary);
                }

                .support-btn:hover {
                    border-color: var(--text-primary);
                    color: var(--text-primary);
                }

                /* App Info */
                .app-info {
                    text-align: center;
                    margin-top: 40px;
                    padding-top: 20px;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                }

                .app-version {
                    font-size: 12px;
                    color: var(--text-secondary);
                    margin-bottom: 8px;
                }

                .app-copyright {
                    font-size: 12px;
                    color: var(--text-secondary);
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

                /* Edit Modal */
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

                .form-input {
                    width: 100%;
                    padding: 12px 16px;
                    background: var(--bg-primary);
                    border: 2px solid transparent;
                    border-radius: 8px;
                    color: var(--text-primary);
                    font-family: var(--font-body);
                    font-size: 16px;
                    margin-bottom: 16px;
                    transition: all 0.3s ease;
                }

                .form-input:focus {
                    outline: none;
                    border-color: var(--accent-primary);
                    box-shadow: 0 0 15px rgba(0, 212, 255, 0.3);
                }

                .modal-actions {
                    display: flex;
                    gap: 12px;
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

                @media (max-width: 768px) {
                    .profile-container {
                        padding: 16px 12px 80px;
                    }
                    
                    .page-title {
                        font-size: 28px;
                    }
                    
                    .profile-stats {
                        flex-direction: column;
                        gap: 16px;
                    }
                }
            </style>
            
            <div class="profile-container">
                <div class="page-header">
                    <h1 class="page-title">Profile</h1>
                    <p class="page-subtitle">Manage your account and preferences</p>
                </div>
                
                <!-- Loading State -->
                <div class="loading-container" id="loading-container">
                    <div class="loading-spinner"></div>
                </div>
                
                <!-- Profile Content -->
                <div id="profile-content" class="hidden">
                    <!-- Profile Card -->
                    <div class="profile-card">
                        <div class="profile-avatar" id="profile-avatar">👤</div>
                        <h2 class="profile-name" id="profile-name">User Name</h2>
                        <p class="profile-email" id="profile-email">user@example.com</p>
                        
                        <div class="profile-stats">
                            <div class="stat-item">
                                <span class="stat-value" id="orders-count">0</span>
                                <span class="stat-label">Orders</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-value" id="saved-count">0</span>
                                <span class="stat-label">Saved</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-value" id="total-spent">$0</span>
                                <span class="stat-label">Total Spent</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Personal Information -->
                    <div class="info-section">
                        <h3 class="section-title">
                            <span class="section-icon">👤</span>
                            Personal Information
                        </h3>
                        
                        <div class="info-item">
                            <span class="info-label">Full Name</span>
                            <div>
                                <span class="info-value" id="display-name">User Name</span>
                                <button class="edit-btn" data-field="name">Edit</button>
                            </div>
                        </div>
                        
                        <div class="info-item">
                            <span class="info-label">Email Address</span>
                            <div>
                                <span class="info-value" id="display-email">user@example.com</span>
                                <button class="edit-btn" data-field="email">Edit</button>
                            </div>
                        </div>
                        
                        <div class="info-item">
                            <span class="info-label">Phone Number</span>
                            <div>
                                <span class="info-value" id="display-phone">+1234567890</span>
                                <button class="edit-btn" data-field="phone">Edit</button>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Delivery Information -->
                    <div class="info-section">
                        <h3 class="section-title">
                            <span class="section-icon">📍</span>
                            Delivery Information
                        </h3>
                        
                        <div class="info-item">
                            <span class="info-label">Default Address</span>
                            <div>
                                <span class="info-value" id="display-address">No address set</span>
                                <button class="edit-btn" data-field="address">Edit</button>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Account Actions -->
                    <div class="action-section">
                        <button class="action-btn orders-btn" id="orders-btn">
                            📋 Order History
                        </button>
                        
                        <button class="action-btn support-btn" id="support-btn">
                            💬 Customer Support
                        </button>
                        
                        <button class="action-btn logout-btn" id="logout-btn">
                            🚪 Logout
                        </button>
                    </div>
                    
                    <!-- App Info -->
                    <div class="app-info">
                        <div class="app-version">FoodRush v1.0.0</div>
                        <div class="app-copyright">© 2024 FoodRush. All rights reserved.</div>
                    </div>
                </div>
            </div>
            
            <!-- Edit Modal -->
            <div class="modal-overlay" id="edit-modal">
                <div class="modal-content">
                    <h3 class="modal-title" id="modal-title">Edit Information</h3>
                    <input type="text" class="form-input" id="edit-input" placeholder="Enter new value">
                    <div class="modal-actions">
                        <button class="modal-btn modal-btn-secondary" id="cancel-edit">Cancel</button>
                        <button class="modal-btn modal-btn-primary" id="save-edit">Save</button>
                    </div>
                </div>
            </div>
        `;
    }

    connectedCallback() {
        this.loadProfileData();
        this.setupEventListeners();
    }

    setupEventListeners() {
        const logoutBtn = this.shadowRoot.getElementById('logout-btn');
        const ordersBtn = this.shadowRoot.getElementById('orders-btn');
        const supportBtn = this.shadowRoot.getElementById('support-btn');
        const editBtns = this.shadowRoot.querySelectorAll('.edit-btn');
        const cancelEdit = this.shadowRoot.getElementById('cancel-edit');
        const saveEdit = this.shadowRoot.getElementById('save-edit');
        const editModal = this.shadowRoot.getElementById('edit-modal');

        logoutBtn.addEventListener('click', () => {
            this.handleLogout();
        });

        ordersBtn.addEventListener('click', () => {
            // this.showOrders(); 
            if (window.foodRushApp) {
                window.foodRushApp.navigateTo('order');
            }
        });

        supportBtn.addEventListener('click', () => {
            this.showSupport();
        });

        editBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const field = btn.dataset.field;
                this.showEditModal(field);
            });
        });

        cancelEdit.addEventListener('click', () => {
            editModal.classList.remove('show');
        });

        saveEdit.addEventListener('click', () => {
            this.saveEdit();
        });

        // Close modal on overlay click
        editModal.addEventListener('click', (e) => {
            if (e.target === editModal) {
                editModal.classList.remove('show');
            }
        });
    }

    async loadProfileData() {
        const loadingContainer = this.shadowRoot.getElementById('loading-container');
        const profileContent = this.shadowRoot.getElementById('profile-content');

        // Show loading
        loadingContainer.style.display = 'flex';
        profileContent.classList.add('hidden');

        // Simulate loading delay
        // await new Promise(resolve => setTimeout(resolve, 500));
        // Токен эсвэл хэрэглэгч байхгүй бол эргэж гарна
        if (!window.foodRushApp?.currentUser?.token) {
            loadingContainer.style.display = 'none';
            profileContent.classList.remove('hidden');
            console.warn('No authenticated user found.');
            return;
        }
        
        try {
            // const token = window.foodRushApp?.authToken; // JWT токен
            const res = await fetch('http://localhost:5500/api/users/profile', {
                headers: {
                    // 'Authorization': `Bearer ${token}`
                    'Authorization': `Bearer ${window.foodRushApp.currentUser.token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!res.ok) {
                const text = await response.text(); // HTML буцааж байгаа тул JSON биш
                console.error('Failed to fetch profile:', text);
                return;
            }

            const data = await res.json();

            if (!data.success) throw new Error(data.message || 'Failed to load profile');

            const user = data.data.user;
            const stats = data.data.stats;

            // Update profile info
            this.shadowRoot.getElementById('profile-name').textContent = user.name || 'User Name';
            this.shadowRoot.getElementById('profile-email').textContent = user.email || 'user@example.com';
            this.shadowRoot.getElementById('display-name').textContent = user.name || 'User Name';
            this.shadowRoot.getElementById('display-email').textContent = user.email || 'user@example.com';
            this.shadowRoot.getElementById('display-phone').textContent = user.phone || '+1234567890';
            this.shadowRoot.getElementById('display-address').textContent = user.address || 'No address set';

            // Update avatar
            const avatar = this.shadowRoot.getElementById('profile-avatar');
            if (user.name) {
                const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();
                avatar.textContent = initials || '👤';
            }

            // Update stats
            this.shadowRoot.getElementById('orders-count').textContent = stats.orderCount || 0;
            this.shadowRoot.getElementById('saved-count').textContent = stats.savedCount || 0;
            this.shadowRoot.getElementById('total-spent').textContent = `$${stats.totalSpent?.toFixed(2) || 0}`;

            // Update localStorage
            if (window.foodRushApp) {
                window.foodRushApp.currentUser = user;
                localStorage.setItem('user', JSON.stringify(user));
            }

        } catch (err) {
            console.error('Failed to load profile:', err);
            if (window.foodRushApp) window.foodRushApp.showNotification(err.message, 'error');
        } finally {
            // Hide loading
            loadingContainer.style.display = 'none';
            profileContent.classList.remove('hidden');
        }
    }

    handleLogout() {
        if (window.foodRushApp) {
            // Show confirmation
            const confirmed = confirm('Are you sure you want to logout?');
            if (confirmed) {
                window.foodRushApp.logout();
            }
        }
    }

    // showOrders() {
    //     if (window.foodRushApp) {
    //         window.foodRushApp.showNotification('Order history coming soon!', 'info');
    //     }
    // }

    showSupport() {
        if (window.foodRushApp) {
            window.foodRushApp.showNotification('Support feature coming soon!', 'info');
        }
    }

    showEditModal(field) {
        const modal = this.shadowRoot.getElementById('edit-modal');
        const modalTitle = this.shadowRoot.getElementById('modal-title');
        const editInput = this.shadowRoot.getElementById('edit-input');
        
        const fieldNames = {
            name: 'Full Name',
            email: 'Email Address',
            phone: 'Phone Number',
            address: 'Delivery Address'
        };

        modalTitle.textContent = `Edit ${fieldNames[field]}`;
        
        const currentValue = this.shadowRoot.getElementById(`display-${field}`).textContent;
        editInput.value = currentValue;
        editInput.placeholder = `Enter new ${fieldNames[field].toLowerCase()}`;
        
        // Set input type based on field
        if (field === 'email') {
            editInput.type = 'email';
        } else if (field === 'phone') {
            editInput.type = 'tel';
        } else {
            editInput.type = 'text';
        }

        modal.classList.add('show');
        modal.dataset.field = field;
        
        // Focus input
        setTimeout(() => editInput.focus(), 100);
    }

    saveEdit() {
        const modal = this.shadowRoot.getElementById('edit-modal');
        const editInput = this.shadowRoot.getElementById('edit-input');
        const field = modal.dataset.field;
        const newValue = editInput.value.trim();

        if (!newValue) {
            if (window.foodRushApp) {
                window.foodRushApp.showNotification('Please enter a valid value', 'error');
            }
            return;
        }

        // Update the display
        this.shadowRoot.getElementById(`display-${field}`).textContent = newValue;
        
        // Update profile card if it's name or email
        if (field === 'name') {
            this.shadowRoot.getElementById('profile-name').textContent = newValue;
            
            // Update avatar initials
            const avatar = this.shadowRoot.getElementById('profile-avatar');
            const initials = newValue.split(' ').map(n => n[0]).join('').toUpperCase();
            avatar.textContent = initials || '👤';
        } else if (field === 'email') {
            this.shadowRoot.getElementById('profile-email').textContent = newValue;
        }

        // Update localStorage
        if (window.foodRushApp && window.foodRushApp.currentUser) {
            window.foodRushApp.currentUser[field] = newValue;
            localStorage.setItem('user', JSON.stringify(window.foodRushApp.currentUser));
        }

        // Close modal
        modal.classList.remove('show');
        
        // Show success message
        if (window.foodRushApp) {
            window.foodRushApp.showNotification('Information updated successfully!', 'success');
        }
    }

    // Method to refresh the page when returning from other pages
    refresh() {
        this.loadProfileData();
    }
}

// Register the component
customElements.define('profile-page', ProfilePage);