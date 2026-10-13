import express from "express";
import { RegisterController } from "../controllers/auth.controller.js";
import { registerValidator } from "../utils/auth.validator.js";

const router=express.Router()

router.post("/register",registerValidator,RegisterController)

export default router;