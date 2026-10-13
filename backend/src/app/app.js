import express from "express";
import cookieParser from "cookie-parser"
import connectdb from "../config/db.config.js";
import authRoutes from "../routes/auth.routes.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser())
app.use("/api/auth", authRoutes);

// Connect to database
connectdb();

export default app;
