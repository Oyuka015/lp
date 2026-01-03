# FoodRush Backend API

Node.js + Express + PostgreSQL backend API for FoodRush food delivery application.

## Features

- **User Authentication** - JWT-based authentication system
- **Food Management** - Complete food catalog with categories and restaurants
- **Shopping Cart** - Persistent cart functionality
- **Order Processing** - Full order lifecycle management
- **Data Validation** - Input validation and sanitization
- **Security** - Rate limiting, CORS, helmet protection
- **Database** - PostgreSQL with proper relationships and indexes

## Prerequisites

- Node.js 16+ 
- PostgreSQL 12+
- npm or yarn

## Installation

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Database Setup

#### Option A: Use existing database
If you already have a PostgreSQL database:

```bash
# Copy environment file
cp .env.example .env

# Edit .env file with your database credentials
nano .env
```

#### Option B: Create new database

```bash
# Connect to PostgreSQL (as postgres user)
psql -U postgres

# Create database
CREATE DATABASE foodrush_db;

# Create user (optional)
CREATE USER foodrush_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE foodrush_db TO foodrush_user;

# Exit
\q
```

### 3. Run Database Migrations

```bash
# Run the setup script
psql -U postgres -d foodrush_db -f database-setup.sql

# Or if using different user
psql -U foodrush_user -d foodrush_db -f database-setup.sql
```

### 4. Configure Environment

Edit `.env` file:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=foodrush_db
DB_USER=foodrush_user
DB_PASSWORD=your_password

# JWT Configuration
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

### 5. Start the Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## API Documentation

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "+1234567890",
    "address": "123 Main St, City"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
    "email": "john@example.com",
    "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <your_jwt_token>
```

### Foods

#### Get All Foods
```http
GET /api/foods
GET /api/foods?category=pizza
GET /api/foods?search=pepperoni
GET /api/foods?minPrice=10&maxPrice=20
GET /api/foods?sort=rating
```

#### Get Single Food
```http
GET /api/foods/{food_id}
```

#### Get Categories
```http
GET /api/foods/categories/all
```

#### Save/Unsave Food
```http
POST /api/foods/{food_id}/save
Authorization: Bearer <your_jwt_token>
```

#### Get Saved Foods
```http
GET /api/foods/saved/all
Authorization: Bearer <your_jwt_token>
```

### Shopping Cart

#### Get Cart
```http
GET /api/cart
Authorization: Bearer <your_jwt_token>
```

#### Add to Cart
```http
POST /api/cart/add
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
    "foodId": "food-uuid",
    "quantity": 2
}
```

#### Update Cart Item
```http
PUT /api/cart/update
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
    "foodId": "food-uuid",
    "quantity": 3
}
```

#### Remove from Cart
```http
DELETE /api/cart/remove/{food_id}
Authorization: Bearer <your_jwt_token>
```

#### Clear Cart
```http
DELETE /api/cart/clear
Authorization: Bearer <your_jwt_token>
```

### Orders

#### Create Order
```http
POST /api/orders
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
    "deliveryAddress": "123 Delivery St, City",
    "notes": "Please ring doorbell"
}
```

#### Get Orders
```http
GET /api/orders
GET /api/orders?status=delivered
GET /api/orders?limit=10&offset=0
```

#### Get Single Order
```http
GET /api/orders/{order_id}
Authorization: Bearer <your_jwt_token>
```

#### Update Order Status
```http
PUT /api/orders/{order_id}/status
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
    "status": "confirmed"
}
```

#### Cancel Order
```http
DELETE /api/orders/{order_id}
Authorization: Bearer <your_jwt_token>
```

### User Profile

#### Get Profile
```http
GET /api/users/profile
Authorization: Bearer <your_jwt_token>
```

#### Update Profile
```http
PUT /api/users/profile
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
    "name": "John Updated",
    "phone": "+1987654321",
    "address": "456 New St, City"
}
```

#### Change Password
```http
PUT /api/users/change-password
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
    "currentPassword": "oldpass123",
    "newPassword": "newpass123"
}
```

#### Delete Account
```http
DELETE /api/users/account
Authorization: Bearer <your_jwt_token>
```

## Database Schema

### Users Table
- `id` (UUID, Primary Key)
- `name` (VARCHAR)
- `email` (VARCHAR, Unique)
- `password_hash` (VARCHAR)
- `phone` (VARCHAR)
- `address` (TEXT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Categories Table
- `id` (UUID, Primary Key)
- `name` (VARCHAR)
- `slug` (VARCHAR, Unique)
- `icon` (VARCHAR)
- `created_at` (TIMESTAMP)

### Foods Table
- `id` (UUID, Primary Key)
- `name` (VARCHAR)
- `description` (TEXT)
- `price` (DECIMAL)
- `image_url` (VARCHAR)
- `category_id` (UUID, Foreign Key)
- `restaurant_id` (UUID, Foreign Key)
- `rating` (DECIMAL)
- `delivery_time` (VARCHAR)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Orders Table
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key)
- `order_number` (VARCHAR, Unique)
- `total_amount` (DECIMAL)
- `status` (VARCHAR)
- `delivery_address` (TEXT)
- `notes` (TEXT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Cart Items Table
- `user_id` (UUID, Foreign Key)
- `food_id` (UUID, Foreign Key)
- `quantity` (INTEGER)
- `added_at` (TIMESTAMP)

### Saved Foods Table
- `user_id` (UUID, Foreign Key)
- `food_id` (UUID, Foreign Key)
- `created_at` (TIMESTAMP)

## Error Handling

The API uses consistent error responses:

```json
{
    "success": false,
    "error": "ErrorType",
    "message": "Human readable error message",
    "details": [] // Validation errors if applicable
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - Bcrypt with 12 salt rounds
- **Input Validation** - Express Validator for all inputs
- **Rate Limiting** - Prevents abuse with request limits
- **CORS** - Configured for specific origins
- **Helmet** - Security headers
- **SQL Injection Protection** - Parameterized queries

## Development

### Running Tests
```bash
npm test
```

### Linting
```bash
npm run lint
```

### Development with Nodemon
```bash
npm run dev
```

## Production Deployment

1. Set `NODE_ENV=production` in .env
2. Use PM2 for process management:
   ```bash
   npm install -g pm2
   pm2 start src/server.js --name foodrush-api
   ```
3. Configure reverse proxy (Nginx)
4. Enable SSL/HTTPS
5. Set up database backups

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | Database host | localhost |
| `DB_PORT` | Database port | 5432 |
| `DB_NAME` | Database name | foodrush_db |
| `DB_USER` | Database user | postgres |
| `DB_PASSWORD` | Database password | - |
| `JWT_SECRET` | JWT secret key | - |
| `JWT_EXPIRE` | JWT expiration | 7d |
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment | development |
| `CORS_ORIGIN` | Allowed CORS origin | http://localhost:8000 |
| `RATE_LIMIT_WINDOW` | Rate limit window (minutes) | 15 |
| `RATE_LIMIT_MAX` | Max requests per window | 100 |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License

## Support

For issues and questions, please open an issue on the project repository.