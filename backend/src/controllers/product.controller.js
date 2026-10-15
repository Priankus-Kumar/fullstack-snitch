import { uploadFile } from "../service/storage.service.js";
import Product from "../models/product.model.js";

export const createProductController = async (req, res) => {
  try {
    const { title, description } = req.body;
    const price = JSON.parse(req.body.price);
    const sizes = JSON.parse(req.body.sizes);

    const fileUrls = [];

    // Upload files
    for (let i = 0; i < req.files.length; i++) {
      const uploadResult = await uploadFile({
        buffer: req.files[i].buffer,
        fileName: req.files[i].originalname,
      });

      fileUrls.push(uploadResult.url);
    }

    // Create product
    const newProduct = await Product.create({
      title,
      description,
      price,
      sizes,
      images: fileUrls,
      seller: req.user.userId,
    });

    return res.status(201).json({
      message: "Product created successfully",
      data: { product: newProduct },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const AllProductController = async (req, res) => {
  try {
    const allProducts = await Product.find();
    res.status(200).json({
      message: "Fetched all products successfully",
      data: { products: allProducts },
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
