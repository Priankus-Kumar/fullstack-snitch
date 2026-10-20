import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectdb from "../config/db.config.js";
import authRoutes from "../routes/auth.routes.js";
import productRoute from "../routes/product.route.js";
import cartRoute from "../routes/cart.routes.js";

import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

//@auth route
app.use("/api/auth", authRoutes);
//@product route
app.use("/api/product", productRoute);
//@cart route
app.use("/api/cart", cartRoute);
// Connect to database
connectdb();

export default app;
