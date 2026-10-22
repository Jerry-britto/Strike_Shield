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

app.get("/health", (_, res) => res.status(200).json({ message: "Server is healthy" }));

import adminRouter from "./routes/admin.routes.js";
app.use("/api/v1/admin",adminRouter)

// --- Single-origin deploy: serve the built client (client/dist) -------------
// Must come AFTER all /api/v1 routes so unknown API paths still 404 properly
// instead of falling back to index.html.
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDist = path.join(__dirname, "../../client/dist");

// static assets; index.html (and SPA deep-links below) handled by the fallback
app.use(express.static(clientDist));

// API 404s must stay JSON — without this, unknown /api paths would be
// swallowed by the SPA fallback below and answer 200 text/html.
app.use("/api", (req, res) => {
  res.status(404).json({ message: "API endpoint not found" });
});

// SPA fallback: any GET that isn't an API route gets index.html so client-side
// routes like /product/<id> survive a refresh. (Express 4 "*" syntax; Express
// 5 would need "{*splat}".) Skipped when the build is absent (pure-dev runs:
// Vite serves the client on :5173, Express only the API).
app.get("*", (req, res, next) => {
  const indexHtml = path.join(clientDist, "index.html");
  if (!fs.existsSync(indexHtml)) return next();
  res.sendFile(indexHtml);
});

export default app
