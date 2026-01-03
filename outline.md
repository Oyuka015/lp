# Food Delivery App - Project Outline

## File Structure
```
/mnt/okcomputer/output/
├── index.html              # Main SPA entry point
├── main.js                 # Core application logic and routing
├── components/             # Web Components directory
│   ├── app-nav.js         # Navigation component
│   ├── auth-page.js       # Login/Register pages
│   ├── home-page.js       # Home page with food listings
│   ├── saved-page.js      # Saved foods page
│   ├── cart-page.js       # Shopping cart page
│   ├── profile-page.js    # User profile page
│   ├── food-card.js       # Individual food item card
│   ├── category-pill.js   # Food category component
│   └── search-bar.js      # Search functionality
├── resources/             # Static assets
│   ├── images/           # Food images and UI assets
│   └── icons/            # SVG icons and graphics
└── README.md             # Project documentation
```

## Component Architecture

### Core Components

1. **app-nav.js**
   - Sticky bottom navigation
   - Home, Saved, Cart, Profile tabs
   - Cart counter with real-time updates
   - Active state indicators

2. **auth-page.js**
   - Login form (email, password)
   - Register form (name, email, password, address, phone)
   - Form validation and error handling
   - JWT token management

3. **home-page.js**
   - User address display (clickable to change)
   - Search bar with real-time filtering
   - Horizontal scrolling food categories
   - Food grid with infinite scroll
   - Food cards with save/add to cart actions

4. **saved-page.js**
   - Current user's saved food items
   - Remove from saved functionality
   - Grid layout similar to home page

5. **cart-page.js**
   - Selected food items list
   - Quantity adjustment controls
   - Total price calculation
   - Checkout button (mock payment)

6. **profile-page.js**
   - User information display
   - Order history (mock data)
   - Logout functionality

### Reusable Components

7. **food-card.js**
   - Food image, name, price
   - Heart/save button
   - Add to cart button
   - Hover effects and animations

8. **category-pill.js**
   - Horizontal scrollable pills
   - Active state styling
   - Click filtering functionality

9. **search-bar.js**
   - Real-time search input
   - Search suggestions
   - Clear button

## Data Flow & State Management

### Local Storage Schema
```javascript
// User data
localStorage.setItem('user', JSON.stringify({
  id: 'uuid',
  name: 'User Name',
  email: 'user@example.com',
  address: 'Delivery Address',
  phone: '+1234567890'
}));

// Authentication
localStorage.setItem('token', 'jwt-token-here');

// Cart items
localStorage.setItem('cart', JSON.stringify([
  { foodId: 'id', quantity: 2, price: 15.99 }
]));

// Saved items
localStorage.setItem('saved', JSON.stringify(['food-id-1', 'food-id-2']));
```

### Mock Food Data Structure
```javascript
const foodItems = [
  {
    id: 'food-1',
    name: 'Pepperoni Pizza',
    category: 'pizza',
    price: 18.99,
    image: 'resources/images/pepperoni-pizza.jpg',
    description: 'Classic pepperoni pizza with mozzarella cheese',
    rating: 4.5,
    deliveryTime: '25-35 min'
  }
];
```

### Categories Data
```javascript
const categories = [
  { id: 'all', name: 'All Food', icon: '🍽️' },
  { id: 'pizza', name: 'Pizza', icon: '🍕' },
  { id: 'burger', name: 'Burgers', icon: '🍔' },
  { id: 'sushi', name: 'Sushi', icon: '🍣' },
  { id: 'pasta', name: 'Pasta', icon: '🍝' },
  { id: 'salad', name: 'Salads', icon: '🥗' },
  { id: 'dessert', name: 'Desserts', icon: '🍰' },
  { id: 'drinks', name: 'Drinks', icon: '🥤' }
];
```

## Routing System (Hash-based)

### Route Structure
- `#/login` - Login page
- `#/register` - Registration page
- `#/home` - Main food listing page
- `#/saved` - Saved foods page
- `#/cart` - Shopping cart page
- `#/profile` - User profile page

### Route Handler Logic
```javascript
window.addEventListener('hashchange', () => {
  const route = window.location.hash.slice(1) || '/home';
  // Route handling logic here
});
```

## API Endpoints (Mock)

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### Food Data
- `GET /api/foods` - Get all food items
- `GET /api/foods?category=pizza` - Filter by category
- `GET /api/foods?search=keyword` - Search foods

### User Actions
- `POST /api/save` - Save food item
- `DELETE /api/save/:foodId` - Remove saved food
- `POST /api/cart` - Add to cart
- `PUT /api/cart/:itemId` - Update cart item
- `DELETE /api/cart/:itemId` - Remove from cart
- `POST /api/checkout` - Process order

## Interactive Features

### Animations & Effects
- Electric pulse on button interactions
- Particle background animation
- Smooth page transitions
- Food card hover effects with 3D tilt
- Loading states with electric arcs
- Cart counter pulse animation

### User Interactions
- Real-time search filtering
- Category filtering with smooth transitions
- Save/unsave food items with heart animation
- Add to cart with quantity selection
- Address change modal
- Form validation with inline feedback
- Infinite scroll for food listings

### Mobile Optimizations
- Touch-friendly button sizes (44px minimum)
- Swipe gestures for category navigation
- Pull-to-refresh functionality
- Optimized image loading
- Smooth scrolling performance