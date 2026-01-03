-- FoodRush Database Setup Script
-- PostgreSQL Database and Tables Creation

-- Create database (run manually)
-- CREATE DATABASE foodrush_db;

-- Connect to database (run manually)
-- \c foodrush_db;

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    icon VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Restaurants table
CREATE TABLE IF NOT EXISTS restaurants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    address TEXT,
    phone VARCHAR(20),
    rating DECIMAL(2,1) DEFAULT 0.0,
    delivery_time VARCHAR(20),
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Foods table
CREATE TABLE IF NOT EXISTS foods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url VARCHAR(500),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE SET NULL,
    rating DECIMAL(2,1) DEFAULT 0.0,
    delivery_time VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Saved foods table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS saved_foods (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    food_id UUID REFERENCES foods(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, food_id)
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    delivery_address TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    food_id UUID REFERENCES foods(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cart table (temporary shopping cart)
CREATE TABLE IF NOT EXISTS cart_items (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    food_id UUID REFERENCES foods(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, food_id)
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    food_id UUID REFERENCES foods(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_foods_category ON foods(category_id);
CREATE INDEX IF NOT EXISTS idx_foods_restaurant ON foods(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_foods_name ON foods(name);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_user ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_foods_user ON saved_foods(user_id);

-- Insert default categories
INSERT INTO categories (name, slug, icon) VALUES 
    ('All Food', 'all', 'all'),
    ('Pizza', 'pizza', 'pizza'),
    ('Burgers', 'burger', 'burger'),
    ('Sushi', 'sushi', 'sushi'),
    ('Pasta', 'pasta', 'pasta'),
    ('Salads', 'salad', 'salad'),
    ('Desserts', 'dessert', 'dessert'),
    ('Drinks', 'drinks', 'drinks')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample restaurants
INSERT INTO restaurants (name, description, address, phone, rating, delivery_time, image_url) VALUES 
    ('Pizza Palace', 'Authentic Italian pizzas with fresh ingredients', '123 Main St, City', '+1234567890', 4.5, '25-35 min', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop'),
    ('Burger Barn', 'Juicy burgers made with premium beef', '456 Oak Ave, City', '+1234567891', 4.7, '20-30 min', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop'),
    ('Sushi Zen', 'Fresh Japanese sushi and sashimi', '789 Pine Rd, City', '+1234567892', 4.9, '30-40 min', 'https://images.unsplash.com/photo-1617196035154-c11f0f6162e0?w=300&h=200&fit=crop'),
    ('Pasta Perfection', 'Homemade pasta with authentic Italian sauces', '321 Elm St, City', '+1234567893', 4.6, '25-35 min', 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=300&h=200&fit=crop'),
    ('Fresh Greens', 'Healthy salads and fresh ingredients', '654 Maple Dr, City', '+1234567894', 4.3, '15-25 min', 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=300&h=200&fit=crop'),
    ('Sweet Dreams', 'Delicious desserts and sweet treats', '987 Cherry Ln, City', '+1234567895', 4.8, '20-30 min', 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300&h=200&fit=crop'),
    ('Smoothie Station', 'Fresh fruit smoothies and healthy drinks', '147 Beach Blvd, City', '+1234567896', 4.4, '10-20 min', 'https://images.unsplash.com/photo-1546173159-315dafa75780?w=300&h=200&fit=crop')
ON CONFLICT DO NOTHING;

-- Insert sample foods
INSERT INTO foods (name, description, price, image_url, category_id, restaurant_id, rating, delivery_time) 
SELECT 
    'Pepperoni Pizza',
    'Classic pepperoni pizza with mozzarella cheese and tomato sauce',
    18.99,
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop',
    (SELECT id FROM categories WHERE slug = 'pizza'),
    (SELECT id FROM restaurants WHERE name = 'Pizza Palace'),
    4.5,
    '25-35 min'
WHERE NOT EXISTS (SELECT 1 FROM foods WHERE name = 'Pepperoni Pizza');

-- Add more sample foods (similar patterns for other foods)
-- You can add more INSERT statements here for the complete food menu

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_foods_updated_at BEFORE UPDATE ON foods
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions (adjust username as needed)
-- GRANT ALL PRIVILEGES ON DATABASE foodrush_db TO your_username;
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_username;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_username;