import express from "express";
import connectdb from "../config/db.config.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(express.json());
await connectdb();

export default app;
