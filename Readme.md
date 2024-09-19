# StrikeShield 🥊

Welcome to **StrikeShield** — your premier online store for top-quality boxing gloves. We offer a wide range of gloves designed for athletes of all levels, ensuring comfort, durability, and superior performance. Built with cutting-edge technologies, our website is designed to make your shopping experience seamless and enjoyable.

---

## Website Features

Our website is built using the **MERN** stack (MongoDB, Express, React, and Node.js). Below is a breakdown of the key modules and features:

### Key Modules

- **Authentication System**: Secure user registration and login system.
- **Cart System**: Allows users to add, remove, and update items in their cart.
- **Product Listing**: A comprehensive catalog of all boxing gloves with filters and search functionality.
- **Custom Payment System**: A flexible payment gateway with a token-based system.
- **Admin Panel**: A dedicated admin dashboard to manage products, orders, and users.

### Features

1. **New User Bonus**  
   All new users receive **10,000 tokens** upon registering, which they can use to purchase any product from our store.

2. **Token Shortage Solution**  
   If a user runs out of tokens while shopping, they can receive an additional **5,000 tokens** by filling out a form. However, they are only eligible to do this once every 5 days.

3. **Discounts & Charges**:
   - **GST**: A **3% GST** is applied to every order.
   - **Bulk Order Discount**: Users purchasing **10 or more items** in a single order get an automatic **10% discount**.
   - **Delivery Charges**: For orders where the total amount (after GST and discounts) is less than **₹500**, an additional **₹500** delivery charge is applied.

---

## Technology Stack

- **Frontend**:  
  Built using **React.js** for a dynamic and responsive user interface.

- **Backend**:  
  Powered by **Node.js** and **Express** for fast, scalable, and robust API services.

- **Database**:  
  **MongoDB** is used for efficient and scalable data storage.

---

## Project Setup

### Prerequisites

To run the project locally, you need to have the following installed:

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [npm](https://www.npmjs.com/)

You also need to configure the following environment variables in a `.env` file:

### Installation Steps in `.env` file

```env
# Set the port number for the application
PORT=3000

# MongoDB connection string
MONGO_URI=your-mongo-uri

# Name of the database
DB_NAME=strikeshield/your_db_name

# Secret key used for generating access tokens
ACCESS_TOKEN=your-secret-token
