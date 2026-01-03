# FoodRush - Food Delivery Web Application

A modern, futuristic food delivery web application built with HTML, CSS, JavaScript, and Web Components. Features a sleek dark theme with neon cyan accents and smooth animations.

## Features

### 🚀 Core Functionality
- **Single Page Application** with hash-based routing
- **User Authentication** - Login and registration system
- **Food Discovery** - Browse food by categories with search functionality
- **Shopping Cart** - Add items, adjust quantities, and checkout
- **Saved Foods** - Save favorite items for quick access
- **User Profile** - Manage account information and preferences

### 🎨 Design & User Experience
- **Futuristic Dark Theme** - Black background with neon cyan and pink accents
- **Responsive Design** - Works on desktop and mobile devices
- **Smooth Animations** - Powered by Anime.js and custom CSS animations
- **Interactive Elements** - Hover effects, loading states, and micro-interactions
- **Particle Background** - Dynamic animated background using Canvas API

### 🛠 Technical Features
- **Web Components** - Modular, reusable UI components
- **Hash Routing** - Client-side routing without page reloads
- **Local Storage** - Persistent user data and cart state
- **Mock API** - Simulated backend with realistic data
- **Progressive Enhancement** - Works without JavaScript for basic functionality

## File Structure

```
/
├── index.html              # Main application entry point
├── main.js                 # Core application logic and routing
├── components/             # Web Components directory
│   ├── app-nav.js         # Bottom navigation component
│   ├── auth-page.js       # Login/Register pages
│   ├── home-page.js       # Main food listing page
│   ├── saved-page.js      # Saved foods page
│   ├── cart-page.js       # Shopping cart page
│   ├── profile-page.js    # User profile page
│   ├── food-card.js       # Individual food item card
│   ├── category-pill.js   # Food category component
│   └── search-bar.js      # Search functionality
├── resources/             # Static assets
│   ├── interface-mockup.png
│   └── (images folder for food images)
├── design.md              # Design system documentation
├── outline.md             # Project architecture outline
└── README.md              # Project documentation
```

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (optional but recommended)

### Installation & Running

1. **Clone or download** the project files

2. **Navigate to the project directory**:
   ```bash
   cd foodrush-app
   ```

3. **Start a local web server**:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```

4. **Open your browser** and navigate to `http://localhost:8000`

### Default Test Account
- **Email**: test@example.com
- **Password**: password123

## Usage Guide

### Navigation
- **Home** (`#home`) - Browse and search for food
- **Saved** (`#saved`) - View your saved favorite foods
- **Cart** (`#cart`) - Review items and checkout
- **Profile** (`#profile`) - Manage account settings

### Key Features

#### Search & Filter
- Use the search bar to find specific foods or restaurants
- Filter by categories (Pizza, Burgers, Sushi, etc.)
- Real-time search with suggestions

#### Shopping Cart
- Add items to cart with quantity controls
- View order summary with taxes and delivery fees
- Proceed to checkout (mock payment process)

#### User Account
- Register with name, email, phone, and address
- Login with email and password
- Edit profile information
- View order history and statistics

#### Saved Foods
- Save favorite items with heart button
- Quick access to saved foods
- Remove items from saved list

## Design System

### Color Palette
- **Primary Background**: Deep Black (#0A0A0A)
- **Secondary Background**: Charcoal Gray (#1A1A1A)
- **Accent Primary**: Neon Cyan (#00D4FF)
- **Accent Secondary**: Electric Pink (#FF006B)
- **Text Primary**: Pure White (#FFFFFF)
- **Text Secondary**: Light Gray (#B0B0B0)

### Typography
- **Display Font**: Orbitron (futuristic headings)
- **Body Font**: Inter (clean, readable content)
- **Monospace**: JetBrains Mono (numbers, prices)

### Visual Effects
- **Particle Background**: Animated cyan particles
- **Electric Pulse**: Button hover animations
- **Smooth Transitions**: Page and state changes
- **3D Hover Effects**: Cards and interactive elements

## Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## Technologies Used

### Core Technologies
- **HTML5** - Semantic markup and Web Components
- **CSS3** - Modern styling with custom properties
- **JavaScript ES6+** - Modern JavaScript features
- **Web Components** - Encapsulated, reusable components

### External Libraries
- **Anime.js** - Smooth animations and micro-interactions
- **Pixi.js** - Advanced visual effects (particle system)
- **ECharts.js** - Data visualization
- **Splide.js** - Image carousels
- **Matter.js** - Physics-based animations
- **P5.js** - Creative coding and visualizations

## Project Architecture

### Component-Based Design
The application uses Web Components for modular, maintainable code:

- **Encapsulation** - Each component manages its own state and styling
- **Reusability** - Components can be used across different pages
- **Composability** - Complex UIs built from simple components

### State Management
- **Local Storage** - Persistent user data and preferences
- **In-Memory State** - Application runtime state
- **Event-Driven** - Components communicate via custom events

### Routing System
- **Hash-Based** - Uses URL fragments for client-side routing
- **History API** - Maintains browser history
- **Dynamic Loading** - Pages rendered on-demand

## Customization

### Adding New Foods
Update the `foodItems` array in `main.js` with new food objects:

```javascript
{
    id: 'food-new',
    name: 'New Food Item',
    category: 'category-name',
    price: 19.99,
    image: 'path/to/image.jpg',
    description: 'Delicious description',
    rating: 4.5,
    deliveryTime: '25-35 min',
    restaurant: 'Restaurant Name'
}
```

### Modifying Colors
Update CSS custom properties in component styles:

```css
:root {
    --accent-primary: #00D4FF;  /* Change primary accent color */
    --accent-secondary: #FF006B; /* Change secondary accent color */
}
```

### Adding New Categories
Update the `categories` array in `main.js`:

```javascript
{
    id: 'new-category',
    name: 'New Category',
    icon: '🍽️'
}
```

## Performance Optimizations

- **Lazy Loading** - Images loaded as needed
- **Debounced Search** - Prevents excessive API calls
- **Component Caching** - Efficient re-rendering
- **Optimized Animations** - Hardware-accelerated CSS transforms

## Future Enhancements

- **Real Backend API** - Connect to actual food delivery service
- **Payment Integration** - Real payment processing
- **Push Notifications** - Order status updates
- **Geolocation** - Automatic address detection
- **Multi-language Support** - Internationalization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For questions or issues, please open an issue on the project repository or contact the development team.

---

**FoodRush** - Fast Delivery, Fresh Food 🚀🍕