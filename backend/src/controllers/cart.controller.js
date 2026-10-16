import Product from "../models/product.model.js";
import Cart from "../models/cart.model.js";

export const AddCartController = async (req, res) => {
  try {
    /**
     * @product model and code from here:=
     * @size and @quantity
     */
    const { productId, quantity, size } = req.body;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(401).json({ message: "Product not found" });
    }

    const selectedSize = product.sizes.find((s) => s.size == size);

    if (!selectedSize) {
      return res.status(400).json({
        message: "Invalid size",
      });
    }

    if (selectedSize.stock < quantity) {
      return res.status(400).json({
        message: "Insufficient stock",
      });
    }
    /**
     * @cart model and there code started from here
     */
    const cart =
      (await Cart.findOne({ user: req.user.userId })) ??
      Cart.create({ user: req.user.userId });

    const productInCart = cart.products.find(
      (p) => p.product.toString() === productId && p.size === size,
    );

    await Cart.updateOne(
      {
        user: req.user.userId,
        "product.product": productId,
        "product.size": size,
      },
      {
        $inc: {
          "product.$.quantity": quantity,
        },
      },
    );

    await Cart.findOneAndUpdate(
      { user: req.user.userId },
      {
        $push: {
          products: { product: productId, qunatity: quantity, size: size },
        },
      },
    );
    return res.status(200).json({
      message: "Product added to cart",
    });
  } catch (error) {
    console.log("error from the cart controller");
    return res
      .status(400)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const AllCartController = async (req, res) => {
  try {
    const cart =
      (await Cart.findOne({ user: req.user.userId })) ??
      (await Cart.create({ user: req.user.userId }));

    return res
      .status(200)
      .json({ message: "Cart reterived successfully", data: { cart: cart } });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Internal Sever Error", error: error.message });
  }
};
