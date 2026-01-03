# PostgreSQL Integration Guide for FoodRush

This guide will help you integrate PostgreSQL database with the FoodRush food delivery application.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Database Setup](#database-setup)
3. [Backend Setup](#backend-setup)
4. [Frontend Integration](#frontend-integration)
5. [Testing the Integration](#testing-the-integration)
6. [Troubleshooting](#troubleshooting)
7. [Advanced Configuration](#advanced-configuration)

## Quick Start

If you want to get everything running quickly:

### Prerequisites
- PostgreSQL installed and running
- Node.js 16+ installed
- npm or yarn package manager

### 1. Setup Database (5 minutes)

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE foodrush_db;

# Exit
\q

# Run the setup script
cd backend
psql -U postgres -d foodrush_db -f database-setup.sql
```

### 2. Configure Backend (3 minutes)

```bash
cp .env.example .env
# Edit .env with your database credentials
```

### 3. Install Dependencies (2 minutes)

```bash
npm install
npm start
```

### 4. Update Frontend (1 minute)

The frontend will automatically detect and use the backend API when it's running.

**Total setup time: ~11 minutes**

---

## Database Setup

### Step 1: Install PostgreSQL

#### Windows
1. Download from [postgresql.org](https://www.postgresql.org/download/windows/)
2. Run the installer
3. Remember the password you set for the postgres user
4. Default port is 5432

#### macOS
```bash
# Using Homebrew
brew install postgresql

# Start PostgreSQL
brew services start postgresql
```

#### Linux (Ubuntu/Debian)
```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Step 2: Create Database and User

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database
CREATE DATABASE foodrush_db;

# Create user (recommended for production)
CREATE USER foodrush_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE foodrush_db TO foodrush_user;

# Grant schema permissions
\c foodrush_db
GRANT USAGE ON SCHEMA public TO foodrush_user;
GRANT CREATE ON SCHEMA public TO foodrush_user;

# Exit
\q
```

### Step 3: Run Database Schema

```bash
cd /path/to/foodrush/backend

# Run setup script
psql -U postgres -d foodrush_db -f database-setup.sql

# Or if using the new user
psql -U foodrush_user -d foodrush_db -f database-setup.sql
```

### Step 4: Verify Database

```bash
# Connect to database
psql -U foodrush_user -d foodrush_db

# Check tables
\dt

# Check data
SELECT * FROM categories;
SELECT * FROM foods LIMIT 5;

# Exit
\q
```

---

## Backend Setup

### Step 1: Install Dependencies

```bash
cd backend
npm install
```

### Step 2: Configure Environment

```bash
# Copy example environment file
cp .env.example .env

# Edit the file with your database credentials
# For Windows:
notepad .env
# For macOS/Linux:
nano .env
```

Your `.env` file should look like:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=foodrush_db
DB_USER=foodrush_user
DB_PASSWORD=your_secure_password

# JWT Configuration (change these for production!)
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production
JWT_EXPIRE=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:8000

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
```

### Step 3: Start the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The backend server will start on `http://localhost:5000`

### Step 4: Test the API

```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Expected response:
# {"status":"OK","message":"FoodRush API is running","timestamp":"...","version":"1.0.0"}
```

---

## Frontend Integration

The frontend is already configured to work with the backend API. When the backend is running, the frontend will automatically detect it and use real data instead of mock data.

### How It Works

1. **API Detection**: The frontend checks for `window.apiClient`
2. **Fallback**: If API is not available, it uses mock data
3. **Authentication**: JWT tokens are automatically handled
4. **Data Flow**: All CRUD operations work with the database

### Frontend API Client

The frontend uses `api/client.js` which provides methods like:

```javascript
// Authentication
apiClient.register(userData)
apiClient.login(email, password)
apiClient.getCurrentUser()

// Foods
apiClient.getFoods({ category: 'pizza', search: 'pepperoni' })
apiClient.getFoodById(foodId)
apiClient.toggleSaveFood(foodId)
apiClient.getSavedFoods()

// Cart
apiClient.getCart()
apiClient.addToCart(foodId, quantity)
apiClient.updateCartItem(foodId, quantity)
apiClient.removeFromCart(foodId)
apiClient.clearCart()

// Orders
apiClient.createOrder(orderData)
apiClient.getOrders()
apiClient.getOrderById(orderId)

// User Profile
apiClient.getUserProfile()
apiClient.updateUserProfile(profileData)
apiClient.changePassword(currentPassword, newPassword)
apiClient.deleteAccount()
```

---

## Testing the Integration

### 1. Test Authentication

```bash
# Register a new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "phone": "+1234567890",
    "address": "123 Test St, City"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 2. Test Foods API

```bash
# Get all foods
curl http://localhost:5000/api/foods

# Get foods by category
curl http://localhost:5000/api/foods?category=pizza

# Search foods
curl http://localhost:5000/api/foods?search=burger

# Get categories
curl http://localhost:5000/api/foods/categories/all
```

### 3. Test Cart Functionality

```bash
# Get JWT token first (from login response)
TOKEN="your_jwt_token_here"

# Add to cart
curl -X POST http://localhost:5000/api/cart/add \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "foodId": "food-uuid-from-database",
    "quantity": 2
  }'

# Get cart
curl -H "Authorization: Bearer $TOKEN" http://localhost:5000/api/cart

# Update quantity
curl -X PUT http://localhost:5000/api/cart/update \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "foodId": "food-uuid-from-database",
    "quantity": 3
  }'
```

### 4. Test Full Application

1. Start backend: `npm start` (in backend folder)
2. Start frontend: Open `index.html` in browser or serve with HTTP server
3. Register a new user in the frontend
4. Browse foods
5. Add items to cart
6. Create an order

---

## Database Schema Overview

### Tables Created

1. **users** - User accounts and profiles
2. **categories** - Food categories (pizza, burger, etc.)
3. **restaurants** - Restaurant information
4. **foods** - Food items with prices and details
5. **cart_items** - User shopping carts
6. **saved_foods** - User's saved/favorite foods
7. **orders** - Order headers
8. **order_items** - Individual items in orders
9. **reviews** - Food reviews and ratings

### Relationships

```
users ──< orders
users ──< cart_items
users ──< saved_foods
users ──< reviews

categories --- foods
restaurants --- foods

foods ──< order_items
orders ──< order_items

foods ──< reviews
```

---

## Troubleshooting

### Common Issues

#### 1. Database Connection Failed

**Error**: `connect ECONNREFUSED 127.0.0.1:5432`

**Solutions**:
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Start PostgreSQL
sudo systemctl start postgresql

# Check PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-*.log
```

#### 2. Authentication Failed

**Error**: `password authentication failed for user "foodrush_user"`

**Solutions**:
```bash
# Reset password
sudo -u postgres psql
ALTER USER foodrush_user WITH PASSWORD 'new_password';
\q

# Update .env file with new password
```

#### 3. Table Doesn't Exist

**Error**: `relation "users" does not exist`

**Solutions**:
```bash
# Re-run database setup
psql -U postgres -d foodrush_db -f backend/database-setup.sql

# Check if you're connected to the right database
psql -U foodrush_user -d foodrush_db
\dt
```

#### 4. CORS Issues

**Error**: `CORS policy: No 'Access-Control-Allow-Origin' header`

**Solutions**:
```javascript
// Update .env
CORS_ORIGIN=http://localhost:8000

// Or allow all origins (development only)
CORS_ORIGIN=*
```

#### 5. Port Already in Use

**Error**: `EADDRINUSE: address already in use :::5000`

**Solutions**:
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or use different port in .env
PORT=5001
```

---

## Advanced Configuration

### 1. Production Database Setup

For production, consider:

- Use connection pooling (already configured)
- Set up database backups
- Use SSL connections
- Configure firewall rules

```env
# Production database config
DB_HOST=your-db-host.com
DB_PORT=5432
DB_NAME=foodrush_production
DB_USER=foodrush_prod_user
DB_PASSWORD=very_secure_password
DB_SSL=true
```

### 2. Environment-Specific Configs

```bash
# Development
NODE_ENV=development

# Staging
NODE_ENV=staging

# Production
NODE_ENV=production
```

### 3. PM2 Process Management

```bash
# Install PM2 globally
npm install -g pm2

# Start with PM2
pm2 start src/server.js --name foodrush-api

# Monitor
pm2 monit

# View logs
pm2 logs foodrush-api

# Restart
pm2 restart foodrush-api
```

### 4. Nginx Reverse Proxy

```nginx
server {
    listen 80;
    server_name api.foodrush.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## Database Management

### Backup Database

```bash
# Backup
pg_dump -U foodrush_user foodrush_db > backup.sql

# Restore
psql -U foodrush_user -d foodrush_db < backup.sql
```

### Monitor Database

```bash
# Check active connections
psql -U postgres -c "SELECT * FROM pg_stat_activity;"

# Check table sizes
psql -U postgres -d foodrush_db -c "SELECT schemaname,tablename,pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) FROM pg_tables ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;"
```

---

## Support

If you encounter issues not covered in this guide:

1. Check the [backend README](backend/README.md)
2. Review database logs
3. Check application logs
4. Verify environment configuration
5. Test database connectivity separately

For additional help, please open an issue with:
- Error messages
- Environment details
- Steps to reproduce
- Expected vs actual behavior