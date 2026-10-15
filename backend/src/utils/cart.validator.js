import { body,  validationResult } from "express-validator";



export const validateAddToCart = [  
  body("productId")
    .notEmpty()
    .withMessage("Product ID is required")
    .bail()
    .isMongoId()
    .withMessage("Invalid product ID"),
  body("quantity")
    .optional()
    .isInt({ min: 1, max: 99 })
    .withMessage("Quantity must be 1-99")
    .bail(),
  body("size")
    .optional()
    .isIn(["XS", "S", "M", "L", "XL", "XXL"])
    .withMessage("Invalid size")
    .bail(),
    (req,res,next)=>{
        const errors=validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                message:"Internal server error",
                errors:errors.array()
            })
        }
        next()
    }
];


