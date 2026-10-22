# 🥊 StrikeShield

**Live demo:** [https://strike-shield.onrender.com/](https://strike-shield.onrender.com/)

StrikeShield is a full-stack e-commerce store for boxing gloves, built entirely from scratch on the **MERN stack** (MongoDB, Express, React, Node.js). It ships with the features you'd expect from a real store — product catalog, cart, checkout, orders, invoices, reviews — plus a custom **token-based payment system** and a full **admin dashboard** with sales analytics.

> **Note:** all payments are made with in-app tokens, not real money. New users start with a token balance they can top up periodically, so the whole purchase flow can be explored without any real payment gateway.

---

## ✨ Features

### Customer

- **Authentication** — register/login with JWT stored in an httpOnly cookie; session persists across refreshes and expires gracefully in the UI.
- **Product catalog** — browse gloves, view details, search, and read/write reviews.
- **Cart** — add, update, and remove items; cart syncs with the server for logged-in users.
- **Token wallet** — every new user gets **10,000 free tokens** to shop with. Run out mid-order? Claim a **5,000-token top-up once every 5 days**.
- **Checkout & orders** — place orders, pay with tokens, view order history and pending payments.
- **Invoices** — downloadable PDF receipts generated client-side.
- **Contact form** — messages land in the admin's support inbox.

### Admin

- **Product management** — add, edit, and remove products (images uploaded to Firebase Storage); one-click seed of the default catalog.
- **Inventory & orders** — track stock levels and order status.
- **Analytics dashboard** — revenue and product performance charts (MUI X Charts).
- **Customer support** — read and respond to customer queries.

### Pricing rules (applied automatically at checkout)

| Rule | Value |
| --- | --- |
| GST | 3% of the order total |
| Bulk discount | 10% off orders of **10+ items** |
| Delivery charge | +₹50 on orders under ₹500 |

---

## 🛠 Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | React 18, Vite, React Router v6, Material UI + Tailwind CSS, Redux Toolkit (+ redux-persist), React Hook Form, react-toastify |
| Backend | Node.js, Express 4 (ESM), JWT auth (httpOnly cookies), Helmet, express-rate-limit |
| Database | MongoDB with Mongoose ODM |
| Media | Firebase Storage (product images) |
| Deployment | Render (single-origin: Express serves the built React app) |

---

## 📁 Project structure

```
.
├── client/                  # React SPA (Vite)
│   └── src/
│       ├── api/             # Central axios instance & interceptors
│       ├── components/      # Reusable UI (Login, Register, navbar, loaders…)
│       ├── layout/          # Page layouts & routing shells
│       ├── pages/           # Route-level pages (Home, Product, Order, Admin)
│       └── store/           # Redux Toolkit store, slices & persistence
└── server/                  # Express REST API
    └── src/
        ├── controllers/     # Route handlers (user, product, cart, order, payment, admin)
        ├── middlewares/     # Auth (JWT), admin guard, rate limiting
        ├── models/          # Mongoose schemas (User, Product, Cart, Order, Payment…)
        ├── routes/          # /api/v1 routers
        ├── utils/           # Firebase upload, seed data
        └── index.js         # App entry (dotenv → DB connect → listen)
```

---

## 🚀 Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- A MongoDB database ([MongoDB Atlas](https://www.mongodb.com/atlas) free tier works fine)
- A [Firebase](https://console.firebase.google.com/) project with Storage enabled (for product image uploads)

### 1. Backend

```bash
cd server
npm install
```

Create `server/.env`:

```env
# Port the API listens on (the client's dev setup expects 8000)
PORT=8000

# MongoDB connection — the app appends /DB_NAME, so omit any trailing slash
MONGO_URI=your-mongo-uri
DB_NAME=your_db_name

# Secret used to sign JWTs
ACCESS_TOKEN=your-secret-token

# Comma-separated list of allowed browser origins (the Vite dev server)
CLIENT_ORIGIN=http://localhost:5173

# Firebase Storage config (used for product image uploads)
FIREBASE_API_KEY=...
FIREBASE_AUTH_DOMAIN=...
FIREBASE_PROJECT_ID=...
FIREBASE_STORAGE_BUCKET=...
FIREBASE_MESSAGING_SENDER_ID=...
FIREBASE_APPID=...
FIREBASE_MEASUREMENTID=...
```

Then start the API:

```bash
npm run dev   # nodemon, http://localhost:8000
```

### 2. Frontend

```bash
cd client
npm install
npm run dev   # Vite, http://localhost:5173
```

In development the client calls `http://localhost:8000/api/v1` automatically. To point it elsewhere (e.g. a split deploy), set `VITE_API_URL` in `client/.env`.

### 3. Production build

The server serves the built SPA from `client/dist` (with an SPA fallback so deep links survive refreshes), so a production deployment is a single origin:

```bash
cd client && npm run build
cd ../server && npm start
```

This is exactly how the [live demo](https://strike-shield.onrender.com/) is deployed on Render.

---

## 🔌 API reference

All endpoints are prefixed with `/api/v1`. Auth endpoints issue an `accessToken` httpOnly cookie — send credentials with `withCredentials: true`. Admin routes require a JWT for a user with `isAdmin: true`.

### Users — `/user`

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| POST | `/register` | — | Create an account (new users get 10,000 tokens) |
| POST | `/login` | — | Log in, sets the JWT cookie *(rate-limited)* |
| POST | `/logout` | JWT | Clear the session |
| GET | `/validuser` | JWT | Check whether the session is still valid |
| POST | `/gettokens` | JWT | Claim a 5,000-token top-up (once every 5 days) |
| POST | `/sendfeedback` | — | Submit a contact/feedback message |

### Products — `/product`

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| GET | `/` | — | List all products |
| GET | `/search` | — | Search products |
| GET | `/getproduct/:pid` | — | Get a single product |
| GET | `/review/:productId` | — | Get reviews for a product |
| POST | `/review/:productId` | JWT | Add a review |
| POST | `/addproduct` | Admin | Create a product |
| PATCH | `/updateproduct/:pid` | Admin | Update a product |
| DELETE | `/removeproduct/:pid` | Admin | Delete a product |
| POST | `/setdefaultproducts` | Admin | Seed the default catalog |

### Cart — `/cart` *(JWT required for all)*

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/` | Get the user's cart |
| POST | `/item/:productId` | Add/update an item |
| DELETE | `/item/:productId` | Remove an item |
| DELETE | `/clear` | Empty the cart |

### Orders & payments — `/orders` *(JWT required for all)*

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/addorder` | Place an order (stock is decremented, payment created) |
| DELETE | `/clearorder/:orderId` | Cancel/clear an order |
| POST | `/payment/:paymentId` | Pay for an order with tokens |
| GET | `/payment` | Payment history |
| GET | `/pending` | Pending payments |

### Admin — `/admin` *(JWT + admin required for all)*

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/analytics` | Revenue & order analytics |
| GET | `/productanalytics` | Product performance data |
| GET | `/getUsers` | List users |
| GET | `/getcustomerresponse` | Customer feedback/queries |

### Health

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/health` | Liveness check (used by Render) |

---

## 🔒 Security notes

- Passwords hashed with bcrypt; auth via JWT in an httpOnly cookie (no token in localStorage).
- `helmet` with a strict Content-Security-Policy, plus CORS restricted to configured origins.
- Rate limiting on login/register (10 requests / 15 min) to blunt brute-force attempts.
- Request bodies capped at 100 KB; `trust proxy` configured for correct IPs behind Render's proxy.

