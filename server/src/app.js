import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: String(process.env.FRONTEND_DOMAIN),
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


export default app
