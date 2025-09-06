# E-Shop Frontend

A professional e-commerce React application built with Bootstrap and modern UI components.

## Features

- **Product Catalog**: Browse and filter products with search functionality
- **Shopping Cart**: Add/remove items, update quantities, and view cart summary
- **Wishlist**: Save favorite products for later
- **User Authentication**: Login and signup functionality
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Indian Currency**: All prices displayed in Indian Rupees (₹)
- **Professional UI**: Modern Bootstrap-based design with custom styling

## Tech Stack

- **React 18**: Modern React with functional components and hooks
- **Bootstrap 5**: Professional UI framework
- **React Bootstrap**: Bootstrap components for React
- **Lucide React**: Beautiful icon library
- **Local Storage**: Persistent cart and wishlist data

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Project Structure

```
src/
├── components/          # React components
│   ├── Navigation.js    # Main navigation bar
│   ├── ProductCard.js   # Individual product card
│   ├── ProductListPage.js # Product listing and filtering
│   ├── CartPage.js      # Shopping cart page
│   ├── LoginPage.js     # User login page
│   ├── SignupPage.js    # User registration page
│   └── WishlistPage.js  # Wishlist page
├── contexts/            # React context for state management
│   └── AppContext.js    # Main application context
├── styles/              # Custom CSS styles
│   └── custom.css       # Bootstrap customizations
├── App.js              # Main application component
├── index.js            # Application entry point
└── index.css           # Global styles
```

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run eject` - Ejects from Create React App (irreversible)

## Demo Credentials

For testing the login functionality:
- **Email**: user@example.com
- **Password**: password

## Key Features

### Product Management
- Product grid with filtering by category and price
- Search functionality across product names and descriptions
- Star ratings and product images
- Add to cart and wishlist functionality

### Shopping Cart
- Persistent cart using localStorage
- Quantity management with +/- buttons
- Real-time total calculation
- Free shipping threshold (₹2000)
- Responsive cart layout

### User Interface
- Modern Bootstrap 5 design
- Custom CSS animations and hover effects
- Responsive design for all screen sizes
- Professional color scheme and typography
- Loading states and error handling

### State Management
- React Context API for global state
- Persistent data with localStorage
- Clean separation of concerns

## Customization

### Styling
- Modify `src/styles/custom.css` for custom styles
- Bootstrap variables can be overridden
- Color scheme defined in CSS custom properties

### Data
- Product data is currently mock data in `AppContext.js`
- Easy to integrate with real API endpoints
- Extensible product schema

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.
