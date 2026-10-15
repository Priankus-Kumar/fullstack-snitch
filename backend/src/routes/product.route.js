import express from "express";
import {
  authenicateSeller,
  authenticate,
} from "../middleware/auth.middleware.js";
import { AllProductController, createProductController } from "../controllers/product.controller.js";
import {createProductValidator} from "../utils/product.validator.js"
/*
 @multer 
 this is the multer code here.
*/
import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1 * 1024 * 1024 }, //1MB
});
// ============================================================================
// ============================================================================

const router = express.Router();

router.post(
  "/",
  authenticate,
  authenicateSeller,
  upload.array("images"), //this is the image array from multer
  createProductValidator,
  createProductController,
);

router.get("/all",AllProductController)

export default router;
