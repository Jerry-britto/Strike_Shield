import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials:true
  })
);

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static("path"))
app.use(cookieParser())

app.get("/",(_,res)=>{ // testing of app
    return res.json({message:"Server is active"})
})

import userRouter from "./routes/user.routes.js";
app.use("/api/v1/user",userRouter);

import productRouter from "./routes/product.routes.js"
app.use("/api/v1/product",productRouter);

export default app
