import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

const app = express();

// Render (and most PaaS) sit behind a proxy and set X-Forwarded-For; without
// this, express-rate-limit rejects every request (it sees an untrusted
// X-Forwarded-For) and req.ip would be the proxy's IP for everyone.
app.set("trust proxy", 1);

app.use(
  cors({
    origin: (process.env.CLIENT_ORIGIN || "http://localhost:5173").split(","),
    credentials:true
  })
);

// Explicit CSP: helmet defaults would block the Google Fonts stylesheet in
// index.html, emotion-injected inline styles (MUI), and Firebase-hosted
// product images. Everything else stays locked down.
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
      },
    },
  })
);

// Brute-force protection on the auth endpoints.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { message: "Too many attempts, please try again later." },
});

app.use(express.json({ limit: "100kb" }))
app.use(express.urlencoded({extended:true, limit:"100kb"}))
app.use(cookieParser())


import userRouter from "./routes/user.routes.js";
app.use("/api/v1/user/login", authLimiter);
app.use("/api/v1/user/register", authLimiter);
app.use("/api/v1/user",userRouter);

import productRouter from "./routes/product.routes.js"
app.use("/api/v1/product",productRouter);

import cartRouter from "./routes/carts.routes.js";
app.use("/api/v1/cart",cartRouter)

import orderRouter from "./routes/order.routes.js"
app.use("/api/v1/orders",orderRouter)

import adminRouter from "./routes/admin.routes.js";
app.use("/api/v1/admin",adminRouter)

export default app
