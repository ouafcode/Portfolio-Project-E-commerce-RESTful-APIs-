# E-commerce Website API

This project aims to build set of RESTful APIs for an e-commerce platform. These APIs will serve as the backend system that enables key functionalities of an e-commerce website, such as managing products, users, orders, payments, and reviews. The APIs will allow clients (such as web or mobile applications) to communicate with the server to perform various actions.

## Features

- **User Authentication and Authorization**: Sign-up, login, and token-based authentication.
- **Product Management**: Add, edit, delete, and view products.
- **Order Management**: Create, view, and manage customer orders.
- **Cart Functionality**: Add to cart, view cart, and remove items.
- **Category & Review Management**: Support for product categories and customer reviews.
- **Payement Integration**: Integration with third-party payment gateways Stripe
- **Review**: Users can do reviews for purshased products.

## Technologies Used

- **Node.js**: JavaScript runtime for building server-side applications.
- **Express.js**: Fast, unopinionated web framework for Node.js.
- **MongoDB**: NoSQL database for efficient, scalable data storage.
- **Mongoose**: MongoDB object modeling for Node.js.
- **JWT**: JSON Web Tokens for user authentication.
- **Bcrypt.js**: For password hashing.
- **Payements**: Stripe.

## Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/ouafcode/Portfolio-Project-E-commerce-RESTful-APIs-.git
   ```

2. **Install dependencies:**

   ```bash
   cd Portfolio-Project-E-commerce-RESTful-APIs
   npm install
   ```

3. **Configure environment variables:**

   Create a `.env` file in the root directory and add the following variables:

   ```
   PORT=8000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

4. **Run the application:**

   ```bash
   npm run start:dev
   ```

   The server will be running on `http://localhost:8000`

5. **API endpoints Documentations:**
   `https://documenter.getpostman.com/view/38120701/2sAXqs72gn`

## API Endpoints

### User Routes

- `POST /api/users/signup` - Register a new user
- `POST /api/users/login` - Login a user and get a token

### Gategories Routes

- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create a new categories (admin only)
- `PUT /api/categories/:id` - Update a categories (admin only)
- `DELETE /api/categories/:id` - Delete a categories (admin only)

### Subcategories Routes

- `GET /api/subcategories` - Get all subcategories
- `POST /api/subcategories` - Create a new subcategories (admin only)
- `PUT /api/subcategories/:id` - Update a subcategories (admin only)
- `DELETE /api/subcategories/:id` - Delete a subcategories (admin only)

### brands Routes

- `GET /api/brands` - Get all brands
- `POST /api/brands` - Create a new brands (admin only)
- `PUT /api/brands/:id` - Update a brands (admin only)
- `DELETE /api/brands/:id` - Delete a brands (admin only)

### Product Routes

- `GET /api/products` - Get all products
- `POST /api/products` - Create a new product (admin only)
- `PUT /api/products/:id` - Update a product (admin only)
- `DELETE /api/products/:id` - Delete a product (admin only)

### Order Routes

- `POST /api/orders` - Create a new order
- `GET /api/orders/:id` - Get details of a specific order

### Cart Routes

- `POST /api/cart` - Add item to the cart
- `GET /api/cart` - View the cart
- `DELETE /api/cart/:id` - Remove an item from the cart

## Future Enhancements

- Integration with payment gateways.
