import express from "express";
import { LoginController, refresh, RegisterController } from "../controllers/auth.controller.js";
import { loginValidator, registerValidator } from "../utils/auth.validator.js";

const router=express.Router()

router.post("/register",registerValidator,RegisterController)
router.post("/login",loginValidator,LoginController)
router.post("/refresh",refresh)
export default router;