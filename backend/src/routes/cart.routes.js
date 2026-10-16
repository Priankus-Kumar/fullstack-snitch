import express from "express";
import { createProductValidator } from "../utils/product.validator.js";
import { AddCartController } from "../controllers/cart.controller.js";
import {authenticate} from "../middleware/auth.middleware.js"
const router = express.Router();

router.get("/", authenticate, createProductValidator, AddCartController);
router.get("/",authenticate)

export default router;
