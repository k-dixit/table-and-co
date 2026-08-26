# Table & Co. — Multi-Restaurant Food Ordering Platform

Table & Co. is a multi-restaurant food ordering website built using vanilla HTML5, CSS3, and JavaScript. The platform allows users to explore different restaurant outlets, browse data-driven food menus, manage isolated shopping carts across brands, authenticate accounts using browser storage, and complete a validated multi-step checkout process with order confirmation.

---

## Features

- **Multi-Brand Restaurant Showcase**: Dynamic homepage featuring interactive brand switching for three distinct outlets with customized color themes, typography, and imagery.
- **Data-Driven Dynamic Menus**: Products are rendered dynamically from modular data structures with real-time category filtering (Burgers, Fries, Drinks, Shakes, Pizzas, Coffee, etc.).
- **Isolated Cart Management**: Full cart functionality (Add, Increase, Decrease, Remove) with isolated `localStorage` keys for each restaurant brand.
- **Automated Financial Calculations**: Real-time subtotal, 10% tax calculation, and dynamic delivery fee computation (Free delivery on orders ₹499 and above; flat ₹40 fee otherwise).
- **Client-Side Authentication System**: Tabbed Login and Registration interface with inline validation, duplicate email prevention, password show/hide toggles, and persistent login sessions.
- **Protected Checkout Flow**: Guest browsing is permitted, but checkout requires authentication. Unauthenticated users are redirected to login and returned seamlessly to checkout upon success.
- **Form Validation**: Strict client-side validation for delivery details including 10-digit mobile numbers and 6-digit postal pincodes with inline error messaging.
- **Order Placement & Confirmation**: Unique Order ID generation (`TC-XXXXXX`), order summary persistence (`tableCoLastOrder`), automatic cart clearing upon placement, and detailed confirmation rendering.

---

## Restaurants

1. **Burger District**
   - **Focus**: Gourmet smash burgers, crispy chicken burgers, loaded fries, and thick shakes.
   - **Cart Storage Key**: `tableCoCart`
2. **Pizza Palace**
   - **Focus**: Artisan wood-fired pizzas, garlic breads, sides, and beverages.
   - **Cart Storage Key**: `tableCoCart_pizza`
3. **Brew Bazaar**
   - **Focus**: Specialty coffees, artisanal teas, bakery snacks, and desserts.
   - **Cart Storage Key**: `tableCoCart_coffee`

---

## Technologies Used

- **HTML5**: Semantic layout elements, form accessibility, and responsive structure.
- **CSS3**: Custom properties (CSS variables), Flexbox, Grid, glassmorphism, animations, and custom styling (No frameworks used).
- **Vanilla JavaScript (ES6)**: DOM manipulation, event delegation, state management, procedural logic, and browser storage handling.
- **Browser localStorage**: Persistent client-side data storage for user accounts, sessions, carts, and order history.

---

## Authentication & User Flow

1. **Guest Browsing**: Users can open the website, switch between restaurants, filter menu items, and add products to their cart without logging in.
2. **Account Registration**: New users register via `auth/login.html` with their full name, email, 10-digit phone number, and password. Duplicate email addresses are automatically flagged and rejected.
3. **Login & Session Storage**: Logging in verifies credentials against stored accounts (`tableCoUsers`). Upon verification, the user object (excluding the password) is saved into `tableCoCurrentUser`.
4. **Navbar Profile Integration**: The top navigation bar automatically updates to display the active user's name with a dropdown menu containing account details and a **Logout** button.
5. **Checkout Protection**: Clicking **Checkout** while logged out saves the target return path into `tableCoReturnUrl` and redirects to the login page. After authentication, the user is automatically returned to the checkout page with their cart intact.

---

## Shopping Cart Architecture

Each restaurant operates with a completely isolated shopping cart stored in browser `localStorage`. Adding items to Burger District does not pollute or overwrite the cart of Pizza Palace or Brew Bazaar.

| Restaurant | Storage Key | Schema |
|---|---|---|
| Burger District | `tableCoCart` | `[ { productId: Number, quantity: Number } ]` |
| Pizza Palace | `tableCoCart_pizza` | `[ { productId: Number, quantity: Number } ]` |
| Brew Bazaar | `tableCoCart_coffee` | `[ { productId: Number, quantity: Number } ]` |

### Pricing Logic
- **Subtotal**: Sum of `(product.price * item.quantity)` for all items in the active brand's cart.
- **Tax**: `Math.round(subtotal * 0.10)` (10% GST).
- **Delivery Fee**: `₹0` if `subtotal >= ₹499`, otherwise `₹40`.
- **Total**: `subtotal + deliveryFee + tax`.

---

## Checkout & Order Flow

```
Homepage / Menu Page
         │
         ▼
   Add Items to Cart
         │
         ▼
   Click "Checkout" ──► (Logged out?) ──► Redirect to Auth (tableCoReturnUrl)
         │                                       │
         ▼                                       ▼
  Checkout Page (Pre-filled User Details) ◄──────┘
         │
         ▼
  Fill Delivery Address & Validate Form
         │
         ▼
  Generate Order ID (TC-XXXXXX) & Save to `tableCoLastOrder`
         │
         ▼
  Clear Active Restaurant Cart from localStorage
         │
         ▼
  Redirect to Order Success Page (`order-success/success.html`)
```

---

## Project Structure

```
Restaurant Chain/
├── assets/                  # Product imagery & brand graphic assets
│   ├── burger/              # Burger District product photos
│   ├── pizza/               # Pizza Palace product photos
│   ├── coffee/              # Brew Bazaar product photos
│   ├── burger.png           # Fallback brand banner image
│   ├── pizza.png            # Fallback brand banner image
│   └── coffee.png           # Fallback brand banner image
├── auth/                    # Client-side authentication module
│   ├── auth.css             # Login & Registration styling
│   ├── auth.js              # Auth state, validation & navbar dropdown script
│   └── login.html           # Tabbed Login/Register page
├── checkout/                # Order checkout module
│   ├── checkout.css         # Checkout form & summary styling
│   ├── checkout.html        # Checkout delivery form page
│   └── checkout.js          # Pre-filling, form validation & order creation
├── coffee-menu/             # Brew Bazaar outlet module
│   ├── coffee-menu.css      # Outlet theme overrides
│   └── coffee-menu.html     # Outlet page
├── data/                    # Data storage layer
│   ├── brands.js            # Landing page hero slider configuration
│   └── menu.js              # Complete menu datasets for all 3 restaurants
├── menu/                    # Burger District outlet module
│   ├── menu.css             # Main menu layout & cart sidebar styling
│   ├── menu.html            # Outlet page
│   └── menu.js              # Dynamic menu rendering & cart engine
├── order-success/           # Order confirmation module
│   ├── success.css          # Confirmation card & summary styling
│   ├── success.html         # Order confirmation view
│   └── success.js           # Order summary renderer & fallback handler
├── pizza-menu/              # Pizza Palace outlet module
│   ├── pizza-menu.css       # Outlet theme overrides
│   └── pizza-menu.html      # Outlet page
├── index.html               # Main landing page & outlet portal
├── script.js                # Landing page hero carousel script
├── styles.css               # Global CSS variables & shared UI styles
└── README.md                # Project documentation
```

---

## Local Storage Data Schema

The application relies strictly on browser `localStorage` for client-side persistence:

- **`tableCoUsers`**: Array storing registered user objects `[{ id, name, email, phone, password }]`.
- **`tableCoCurrentUser`**: Active user session object `[{ id, name, email, phone }]` (Password excluded for security).
- **`tableCoReturnUrl`**: String path (e.g., `"../checkout/checkout.html"`) used for post-login redirection.
- **`tableCoCart`**: Shopping cart array for Burger District.
- **`tableCoCart_pizza`**: Shopping cart array for Pizza Palace.
- **`tableCoCart_coffee`**: Shopping cart array for Brew Bazaar.
- **`tableCoLastOrder`**: Object containing the most recently placed order details, customer information, line items, and pricing breakdown.

---

## How to Run

1. **Clone / Download** the project repository to your local computer.
2. Open the project folder in **Visual Studio Code** or any code editor.
3. Open `index.html` using a local web server (e.g., VS Code **Live Server** extension) or double-click `index.html` to open directly in any modern web browser (Google Chrome, Microsoft Edge, Firefox, Safari).
4. No node modules, npm commands, build tools, or backend servers are required.

---

## Testing & Quality Assurance

The application flows have been thoroughly verified:
- **Authentication**: Verified single-page tab switching, password toggling, inline error messages, duplicate email blocking, and login state persistence.
- **Cart Operations**: Verified item addition, quantity modification (`+`/`-`), removal when quantity reaches 0, and isolated cart keys across all three restaurants.
- **Checkout & Protection**: Verified redirect of logged-out users, post-authentication return to checkout, auto-filling user details, and strict form validation.
- **Order Placement**: Verified generation of `TC-XXXXXX` Order ID, storage in `tableCoLastOrder`, cart clearing, and rendering of the confirmation receipt.
- **Browser Compatibility**: Verified 0 console errors during full end-to-end execution.

---

## Future Improvements

Potential enhancements for future iterations of this platform:
- **Backend & Database**: Integration with Node.js/Express backend and MongoDB/PostgreSQL database.
- **Secure Password Hashing**: Implementation of bcrypt hashing for user credentials.
- **Payment Gateway**: Integration of Razorpay/Stripe API for live online payment processing.
- **Order History**: User profile dashboard displaying past orders retrieved from a server database.
- **Real-Time Tracking**: Live order status tracking using WebSockets.

---

## Author

- **Name**: [Your Name]
- **Course / College**: [Course Name / College Name]
