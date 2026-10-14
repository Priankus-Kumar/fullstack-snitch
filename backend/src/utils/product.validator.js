import { body, param, validationResult } from "express-validator";

export const createProductValidator = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .bail()
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be 3-100 characters")
    .trim(),

  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .bail()
    .isLength({ min: 10, max: 2000 })
    .withMessage("Description must be 10-2000 characters")
    .trim(),

  body("images").optional().isArray().withMessage("Images must be an array"),

  body("images.*.url")
    .optional()
    .isURL()
    .withMessage("Image URL must be valid"),

  body("price.amount")
    .notEmpty()
    .withMessage("Price amount is required")
    .bail()
    .isFloat({ min: 0, max: 1000000 })
    .withMessage("Price must be 0-1,000,000"),

  body("price.currency")
    .optional()
    .isIn(["INR", "USD"])
    .withMessage("Currency either be INR or USD"),

  body("sizes")
    .exists()
    .withMessage("Sizes are required")
    .bail()
    .isArray()
    .withMessage("Sizes must be an array of object"),
  body("sizes.*.size")
    .exists()
    .withMessage("size must be present in every entry of sizes array")
    .bail()
    .isString()
    .withMessage("size must be a string value")
    .bail()
    .trim()
    .isIn(["XS", "S", "M", "L", "XL", "XXL"])
    .withMessage("size can be one of these XS, S, M, L, XL, XXL."),
  body("sizes.*.stock")
    .exists()
    .withMessage("stock must be present in every entry of the sizes array")
    .bail()
    .isInt({ min: 0 })
    .withMessage("Stock must be a integer value"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty) {
      return res.status(400).json({
        message: "invalid Request",
        errors: errors.array(),
      });
    }
    next();
  },
];
