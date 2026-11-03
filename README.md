# Table & Co. — Multi-Restaurant Food Ordering Platform

Table & Co. is a full-stack, multi-restaurant food ordering and management website built using HTML5, CSS3, JavaScript, Node.js, Express.js and MongoDB.

The platform allows customers to explore three restaurant brands, browse dynamically loaded menus, manage separate shopping carts, register and log in securely, and place orders. Administrators can manage menu items and upload product images through protected backend APIs.

## Features

- **Multi-Brand Restaurant Showcase:** Interactive homepage featuring three restaurant brands with customized themes and imagery.
- **Dynamic Menus:** Menu items are fetched from MongoDB through backend APIs and rendered dynamically.
- **Category Filtering:** Filter products by categories such as Burgers, Fries, Drinks, Shakes, Pizzas and Coffee.
- **Isolated Shopping Carts:** Separate localStorage carts for each restaurant.
- **User Registration and Login:** Backend-based authentication with bcrypt password hashing.
- **JWT Authentication:** Token-based authentication for protected API endpoints.
- **Role-Based Authorization:** Separate customer and administrator roles.
- **Admin Menu Management:** Create, read, update and delete menu items.
- **Image Uploads:** Multer handles product image uploads and stores images in the server's uploads directory.
- **Checkout:** Validated checkout process with customer and delivery information.
- **Database-Backed Orders:** Customer orders are saved persistently in MongoDB.
- **Server-Side Price Validation:** Product prices are retrieved from MongoDB rather than trusted from frontend requests.
- **Order Confirmation:** Displays order details after successful order placement.

## Restaurants

| Restaurant | Identifier | Cart Storage Key |
|---|---|---|
| Burger District | `burger` | `tableCoCart` |
| Pizza Palace | `pizza` | `tableCoCart_pizza` |
| Brew Bazaar | `coffee` | `tableCoCart_coffee` |

## Technologies Used

### Frontend
- **HTML5:** Page structure and forms.
- **CSS3:** Responsive layouts, animations, Flexbox and Grid.
- **Vanilla JavaScript (ES6):** DOM manipulation, cart management, form validation and API communication.
- **localStorage:** Maintains separate shopping carts and frontend session information.

### Backend
- **Node.js:** JavaScript runtime environment for executing server-side code.
- **Express.js:** Framework for creating REST APIs, handling HTTP requests and managing routes.
- **Mongoose:** ODM library for interacting with MongoDB using schemas and models.
- **JWT:** Token-based authentication and authorization.
- **bcrypt:** Secure password hashing and verification.
- **Multer:** Middleware for handling product image uploads.
- **CORS:** Allows communication between the frontend and backend development servers.

### Database
- **MongoDB Community Server:** NoSQL database for storing users, menu items and orders.
- **MongoDB Compass:** GUI for viewing and managing database collections and documents.

## System Architecture

The project follows a frontend-backend-database architecture.

```text
                 CUSTOMER / ADMIN
                        |
                        v
              FRONTEND (HTML, CSS, JS)
                        |
                   HTTP / JSON
                        |
                        v
               NODE.JS + EXPRESS.JS
                        |
              +---------+---------+
              |         |         |
              v         v         v
             JWT      MULTER   API ROUTES
              |         |         |
              |         v         |
              |    Uploads Folder |
              |                   |
              +---------+---------+
                        |
                        v
                   MONGOOSE
                        |
                        v
                     MONGODB
                        |
              +---------+---------+
              |         |         |
              v         v         v
           menuitems  users     orders
```

The frontend communicates with the Express backend through HTTP requests. The backend validates requests, interacts with MongoDB through Mongoose and returns JSON responses.

## Database Design

**Database Name:** `tableco`

The database contains three primary collections.

### 1. menuitems

Stores products for all three restaurant brands.

| Field | Data Type | Description |
|---|---|---|
| `id` | Number | Application-level menu item ID |
| `restaurant` | String | burger, pizza or coffee |
| `name` | String | Product name |
| `category` | String | Product category |
| `price` | Number | Product price |
| `description` | String | Product description |
| `image` | String | Product image path |

The project contains **69 seeded menu items** across the three restaurants.

A compound unique index is implemented on:

```javascript
{ restaurant: 1, id: 1 }
```

This allows different restaurants to use the same menu item ID while preventing duplicate IDs within the same restaurant.

### 2. users

Stores registered customer and administrator accounts.

| Field | Description |
|---|---|
| `name` | User's name |
| `email` | Unique email address |
| `password` | bcrypt-hashed password |
| `role` | customer or admin |

Passwords are hashed before being stored in MongoDB.

### 3. orders

Stores customer orders, including:

- Customer information
- Restaurant identifier
- Ordered items and quantities
- Product prices
- Subtotal
- Tax
- Delivery charges
- Final order total

Orders are saved persistently in MongoDB and retrieved through protected backend APIs.

## Backend Architecture

The backend is organized into separate configuration, middleware, model, route and script directories.

```text
server/
|
|-- config/
|   |-- db.js
|
|-- middleware/
|   |-- authMiddleware
|   |-- uploadMiddleware.js
|
|-- models/
|   |-- MenuItem.js
|   |-- User.js
|   |-- Order.js
|
|-- routes/
|   |-- authRoutes.js
|   |-- menuRoutes.js
|   |-- orderRoutes.js
|
|-- scripts/
|   |-- seedMenu.js
|
|-- uploads/
|
|-- .gitignore
|-- package.json
|-- package-lock.json
|-- server.js
```

### Important Backend Files

| File | Responsibility |
|---|---|
| `server.js` | Initializes Express, middleware, routes and database connection |
| `config/db.js` | Establishes MongoDB connection |
| `models/MenuItem.js` | Defines menu item schema and model |
| `models/User.js` | Defines user schema and model |
| `models/Order.js` | Defines order schema and model |
| `routes/authRoutes.js` | Handles registration and login |
| `routes/menuRoutes.js` | Handles menu retrieval and CRUD operations |
| `routes/orderRoutes.js` | Handles order creation and retrieval |
| `middleware/authMiddleware` | Handles JWT verification and admin authorization |
| `middleware/uploadMiddleware.js` | Configures Multer image uploads |
| `scripts/seedMenu.js` | Inserts initial menu data into MongoDB |

## Authentication and Authorization

The application uses JWT-based authentication and bcrypt password hashing.

### Registration
1. The frontend collects the user's name, email and password.
2. The information is sent to the backend.
3. The backend hashes the password using bcrypt.
4. The user account is stored in MongoDB's `users` collection.

### Login
1. The user submits their email and password.
2. The backend searches MongoDB for the user.
3. bcrypt verifies the submitted password against the stored hash.
4. If the credentials are valid, the backend generates a signed JWT.
5. The token is returned to the frontend.

The frontend stores authentication information using:

```javascript
localStorage.setItem("tableCoToken", token);
localStorage.setItem("tableCoCurrentUser", user);
```

### Protected Requests

The frontend sends the JWT through the Authorization header:

```http
Authorization: Bearer YOUR_TOKEN
```

The backend uses:

- `verifyToken` to verify authentication.
- `requireAdmin` to restrict administrator operations.

The middleware verifies the token and identifies the authenticated user before allowing access to protected routes.

## Admin Menu Management and Image Uploads

Administrators can manage menu products using protected REST API endpoints.

### CRUD Operations

| Operation | HTTP Method | Purpose |
|---|---|---|
| Create | POST | Add a menu item |
| Read | GET | Retrieve menu items |
| Update | PUT | Update a menu item |
| Delete | DELETE | Remove a menu item |

### Image Upload Workflow

Multer handles product image uploads.

1. An administrator submits an image.
2. The frontend sends it using `multipart/form-data`.
3. Multer processes the uploaded file.
4. The image is stored in the backend uploads directory.
5. The image path is stored in the corresponding MongoDB document.
6. Express serves the uploads directory so the frontend can display the image.

MongoDB stores the image path, not the actual image file.

## Shopping Cart Architecture

Each restaurant maintains an independent cart in browser localStorage.

| Restaurant | Storage Key |
|---|---|
| Burger District | `tableCoCart` |
| Pizza Palace | `tableCoCart_pizza` |
| Brew Bazaar | `tableCoCart_coffee` |

Each cart stores product identifiers and quantities.

The frontend handles adding items, updating quantities, removing products and displaying the cart summary.

## Checkout and Order Workflow

```text
Homepage / Restaurant Menu
           |
           v
     Add Items to Cart
           |
           v
       Click Checkout
           |
           v
    Check Authentication
           |
      +----+----+
      |         |
      v         v
   Logged In  Logged Out
      |         |
      |         v
      |     Login / Register
      |         |
      +----+----+
           |
           v
      Checkout Page
           |
           v
   Validate Delivery Details
           |
           v
   Submit Order with JWT
           |
           v
