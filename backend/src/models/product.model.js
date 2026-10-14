import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Product title is required"],
    trim: true,
    maxlength: [100, "Title cannot exceed 100 characters"],
    minlength: [3, "Title must be at least 3 characters"],
  },
  description: {
    type: String,
    required: [true, "Product description is required"],
    trim: true,
    maxlength: [2000, "Description cannot exceed 2000 characters"],
    minlength: [10, "Description must be at least 10 characters"],
  },
  images: {
    type: [
      {
        type: String,
      },
    ],
    validate: {
      validator: (images) => images.length <= 5,
      message: "A product can have at most 5 images",
    },
  },
  price: {
    amount: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
      max: [1000000, "Price cannot exceed 1,000,000"],
    },
    currency: {
      type: String,
      required: [true, "Currency is required"],
      enum: ["USD", "INR"],
      default: "USD",
      uppercase: true,
    },
  },
  sizes: [
    {
      size: {
        type: String,
        required: true,
        enum: [
          "XS",
          "S",
          "M",
          "L",
          "XL",
          "XXL",
          "28",
          "30",
          "32",
          "34",
          "36",
          "38",
          "40",
          "42",
          "44",
          "46",
        ],
      },
      stock: {
        type: Number,
        required: true,
        min: [0, "Quantity cannot be negative"],
        default: 0,
      },
    },
  ],

  seller: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: [true, "Seller is required"],
  },
  published: {
    type: Boolean,
    default: false,
  },
});

const Product = mongoose.model("Product", productSchema);

export default Product;


/**
 * 
*.       product :{
*.       title:"test title 1",
*.       description:"test description 1",
*.       images:["https://imagekit.io_1","https://imagekit.io_2"],
*.       price:{amount:100,currency:"INR"},
*.       sizes:[
*.       { size:"M",stock:20 },
*.       { size:"XL",stock:40}
*.       ],
*.       seller: seller_id
*.       }
 * 
 */