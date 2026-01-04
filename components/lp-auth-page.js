class AuthPage extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.mode = this.getAttribute('mode') || 'login';
        this.render();
        this.setupEventListeners();
    }

    static get observedAttributes() {
        return ['mode'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'mode' && oldValue !== newValue) {
            this.mode = newValue;
            this.render();
            this.setupEventListeners();
        }
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
                }

                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                .auth-container {
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    padding: 20px;
                    background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
                }

                .auth-header {
                    text-align: center;
                    margin-bottom: 40px;
                }

                .app-logo {
                    font-family: var(--font-display);
                    font-size: 48px;
                    font-weight: 900;
                    background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    margin-bottom: 8px;
                    text-shadow: 0 0 30px rgba(0, 212, 255, 0.3);
                }

                .app-tagline {
                    font-size: 16px;
                    color: var(--text-secondary);
                    font-weight: 400;
                }

                .auth-card {
                    background: rgba(26, 26, 26, 0.8);
                    backdrop-filter: blur(10px);
                    border-radius: 16px;
                    padding: 32px;
                    width: 100%;
                    max-width: 400px;
                    border: 1px solid rgba(0, 212, 255, 0.2);
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                }

                .auth-title {
                    font-family: var(--font-display);
                    font-size: 24px;
                    font-weight: 700;
                    color: var(--text-primary);
                    text-align: center;
                    margin-bottom: 24px;
                }

                .form-group {
                    margin-bottom: 20px;
                }

                .form-label {
                    display: block;
                    font-size: 14px;
                    font-weight: 600;
                    color: var(--text-primary);
                    margin-bottom: 8px;
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
                    transition: all 0.3s ease;
                }

                .form-input:focus {
                    outline: none;
                    border-color: var(--accent-primary);
                    box-shadow: 0 0 15px rgba(0, 212, 255, 0.3);
                }

                .form-input::placeholder {
                    color: var(--text-secondary);
                }

                .btn-primary {
                    width: 100%;
                    background: linear-gradient(135deg, var(--accent-primary), #0099CC);
                    border: none;
                    color: var(--text-primary);
                    padding: 14px 24px;
                    border-radius: 8px;
                    font-family: var(--font-body);
                    font-weight: 600;
                    font-size: 16px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    margin-top: 8px;
                }

                .btn-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(0, 212, 255, 0.4);
                }

                .btn-primary:active {
                    transform: translateY(0);
                }

                .btn-secondary {
                    width: 100%;
                    background: transparent;
                    border: 2px solid var(--accent-secondary);
                    color: var(--accent-secondary);
                    padding: 12px 22px;
                    border-radius: 8px;
                    font-family: var(--font-body);
                    font-weight: 600;
                    font-size: 16px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    margin-top: 12px;
                }

                .btn-secondary:hover {
                    background: var(--accent-secondary);
                    color: var(--text-primary);
                    box-shadow: 0 8px 25px rgba(255, 0, 107, 0.4);
                }

                .auth-footer {
                    text-align: center;
                    margin-top: 24px;
                }

                .auth-link {
                    color: var(--accent-primary);
                    text-decoration: none;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .auth-link:hover {
                    text-decoration: underline;
                    text-shadow: 0 0 10px var(--accent-primary);
                }

                .error-message {
                    background: rgba(255, 0, 107, 0.1);
                    border: 1px solid var(--accent-secondary);
                    color: var(--accent-secondary);
                    padding: 12px;
                    border-radius: 8px;
                    margin-bottom: 16px;
                    font-size: 14px;
                    text-align: center;
                }

                .success-message {
                    background: rgba(0, 212, 255, 0.1);
                    border: 1px solid var(--accent-primary);
                    color: var(--accent-primary);
                    padding: 12px;
                    border-radius: 8px;
                    margin-bottom: 16px;
                    font-size: 14px;
                    text-align: center;
                }

                .loading {
                    display: inline-block;
                    width: 20px;
                    height: 20px;
                    border: 3px solid transparent;
                    border-radius: 50%;
                    border-top-color: var(--text-primary);
                    animation: spin 1s ease-in-out infinite;
                    margin-right: 8px;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                .password-strength {
                    height: 4px;
                    background: var(--bg-primary);
                    border-radius: 2px;
                    margin-top: 8px;
                    overflow: hidden;
                }

                .password-strength-bar {
                    height: 100%;
                    width: 0%;
                    transition: all 0.3s ease;
                    border-radius: 2px;
                }

                .password-strength-bar.weak {
                    width: 33%;
                    background: #ff4757;
                }

                .password-strength-bar.medium {
                    width: 66%;
                    background: #ffa502;
                }

                .password-strength-bar.strong {
                    width: 100%;
                    background: #2ed573;
                }

                @media (max-width: 480px) {
                    .auth-card {
                        padding: 24px;
                        margin: 0 16px;
                    }
                    
                    .app-logo {
                        font-size: 36px;
                    }
                }
            </style>
            
            <div class="auth-container">
                <div class="auth-header">
                    <h1 class="app-logo">FOODRUSH</h1>
                    <p class="app-tagline">Fast Delivery, Fresh Food</p>
                </div>
                
                <div class="auth-card">
                    <h2 class="auth-title">${
                      this.mode === "login" ? "Welcome Back" : "Create Account"
                    }</h2>
                    
                    <div id="message-container"></div>
                    
                    <form id="auth-form">
                        ${
                          this.mode === "register"
                            ? `
                            <div class="form-group">
                                <label class="form-label" for="name">Full Name</label>
                                <input type="text" id="name" class="form-input" placeholder="Enter your full name" required>
                            </div>
                        `
                            : ""
                        }
                        
                        <div class="form-group">
                            <label class="form-label" for="email">Email Address</label>
                            <input type="email" id="email" class="form-input" placeholder="Enter your email" required>
                        </div>
                        
                        ${
                          this.mode === "register"
                            ? `
                            <div class="form-group">
                                <label class="form-label" for="phone">Phone Number</label>
                                <input type="tel" id="phone" class="form-input" placeholder="Enter your phone number" required>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label" for="address">Delivery Address</label>
                                <input type="text" id="address" class="form-input" placeholder="Enter your delivery address" required>
                            </div>
                        `
                            : ""
                        }
                        
                        <div class="form-group">
                            <label class="form-label" for="password">Password</label>
                            <input type="password" id="password" class="form-input" placeholder="Enter your password" required minlength="6">
                            ${
                              this.mode === "register"
                                ? `
                                <div class="password-strength">
                                    <div class="password-strength-bar" id="password-strength-bar"></div>
                                </div>
                            `
                                : ""
                            }
                        </div>
                        
                        ${
                          this.mode === "register"
                            ? `
                            <div class="form-group">
                                <label class="form-label" for="confirm-password">Confirm Password</label>
                                <input type="password" id="confirm-password" class="form-input" placeholder="Confirm your password" required minlength="6">
                            </div>
                        `
                            : ""
                        }
                        
                        <button type="submit" class="btn-primary" id="submit-btn">
                            ${
                              this.mode === "login"
                                ? "Sign In"
                                : "Create Account"
                            }
                        </button>
                    </form>
                    
                    <div class="auth-footer">
                        ${
                          this.mode === "login"
                            ? `
                            <p style="color: var(--text-secondary); font-size: 14px;">
                                Don't have an account? 
                                <span class="auth-link" id="switch-to-register">Sign up here</span>
                            </p>
                        `
                            : `
                            <p style="color: var(--text-secondary); font-size: 14px;">
                                Already have an account? 
                                <span class="auth-link" id="switch-to-login">Sign in here</span>
                            </p>
                        `
                        }
                    </div>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        const form = this.shadowRoot.getElementById('auth-form');
        const submitBtn = this.shadowRoot.getElementById('submit-btn');
        const switchToRegister = this.shadowRoot.getElementById('switch-to-register');
        const switchToLogin = this.shadowRoot.getElementById('switch-to-login');
        
        // Form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Switch between login and register
        if (switchToRegister) {
            switchToRegister.addEventListener('click', () => {
                this.setAttribute('mode', 'register');
            });
        }

        if (switchToLogin) {
            switchToLogin.addEventListener('click', () => {
                this.setAttribute('mode', 'login');
            });
        }

        // Password strength indicator for registration
        if (this.mode === 'register') {
            const passwordInput = this.shadowRoot.getElementById('password');
            const strengthBar = this.shadowRoot.getElementById('password-strength-bar');
            
            passwordInput.addEventListener('input', (e) => {
                this.updatePasswordStrength(e.target.value, strengthBar);
            });
        }
    }

    async handleSubmit() {
        const submitBtn = this.shadowRoot.getElementById('submit-btn');
        // const messageContainer = this.shadowRoot.getElementById('message-container');
        
        // Show loading state
        submitBtn.innerHTML = '<span class="loading"></span>Processing...';
        submitBtn.disabled = true;
        
        try {
            if (this.mode === 'login') {
                await this.handleLogin();
            } else {
                await this.handleRegister();
            }
        } catch (error) {
            this.showMessage(error.message, 'error');
        } finally {
            submitBtn.innerHTML = this.mode === 'login' ? 'Sign In' : 'Create Account';
            submitBtn.disabled = false;
        }
    }

    async handleLogin() {
        const email = this.shadowRoot.getElementById('email').value.trim();
        const password = this.shadowRoot.getElementById('password').value;
        
        // Validation
        if (!email || !password) {
            throw new Error('Please fill in all fields');
        }
        
        if (!this.isValidEmail(email)) {
            throw new Error('Please enter a valid email address');
        }
        
        if (password.length < 6) {
            throw new Error('Password must be at least 6 characters');
        }
        
        const response = await fetch('http://localhost:5500/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            this.showMessage('Login successful! Redirecting...', 'success');
            // Save token to localStorage if backend returns JWT
            if (data.token){
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));

                window.foodRushApp.currentUser = { ...data.user, token: data.token };
            } 
            
            window.location.href = '/';
        } else {
            throw new Error(data.message || 'Login failed');
        }
    }

    async handleRegister() {
        const name = this.shadowRoot.getElementById('name').value.trim();
        const email = this.shadowRoot.getElementById('email').value.trim();
        const phone = this.shadowRoot.getElementById('phone').value.trim();
        const address = this.shadowRoot.getElementById('address').value.trim();
        const password = this.shadowRoot.getElementById('password').value;
        const confirmPassword = this.shadowRoot.getElementById('confirm-password').value;
        
        // Validation
        if (!name || !email || !phone || !address || !password || !confirmPassword) {
            throw new Error('Please fill in all fields');
        }
        
        if (!this.isValidEmail(email)) {
            throw new Error('Please enter a valid email address');
        }
        
        if (password.length < 6) {
            throw new Error('Password must be at least 6 characters');
        }
        
        if (password !== confirmPassword) {
            throw new Error('Passwords do not match');
        }
        
        if (!this.isValidPhone(phone)) {
            throw new Error('Please enter a valid phone number');
        }
        
        // Mock registration delay
        // await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Call app register method
        const userData = { name, email, phone, address, password };

        const response = await fetch('http://localhost:5500/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });

        const data = await response.json();

        if (response.ok) {
            this.showMessage('Registration successful! Redirecting...', 'success');
            window.location.href = '/#login';
        } else {
            throw new Error(data.message || 'Registration failed');
        }
    }

    updatePasswordStrength(password, strengthBar) {
        let strength = 0;
        
        if (password.length >= 6) strength++;
        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        
        strengthBar.className = 'password-strength-bar';
        
        if (strength < 2) {
            strengthBar.classList.add('weak');
        } else if (strength < 4) {
            strengthBar.classList.add('medium');
        } else {
            strengthBar.classList.add('strong');
        }
    }

    showMessage(message, type) {
        const messageContainer = this.shadowRoot.getElementById('message-container');
        messageContainer.innerHTML = `
            <div class="${type}-message">
                ${message}
            </div>
        `;
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            messageContainer.innerHTML = '';
        }, 5000);
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }
}

// Register the component
customElements.define('auth-page', AuthPage);