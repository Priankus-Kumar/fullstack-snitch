import mongoose, { mongo } from "mongoose";

const CartSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        required: true,
      },
      qunatity: {
        type: Number,
        default: 1,
        min: 1,
      },
      size: {
        type: String,
        enum: ["XS", "S", "M", "L", "XL", "XXL"],
      },
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
    required: true,
  },
});

const Cart = mongoose.model("cart", CartSchema);
export default Cart;
