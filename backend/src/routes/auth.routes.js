import express from "express";
import {
  getMe,
  LoginController,
  LogoutController,
  refresh,
  RegisterController,
} from "../controllers/auth.controller.js";
import { loginValidator, registerValidator } from "../utils/auth.validator.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router=express.Router()

router.post("/register",registerValidator,RegisterController)
router.post("/login",loginValidator,LoginController)
router.post("/refresh",refresh)
router.post("/logout",LogoutController)
router.get("/getme",authenticate,getMe)
export default router;