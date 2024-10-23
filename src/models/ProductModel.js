import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    offerPrice: {
      type: Number,
      required: false,
    },
    image: {
      type: String,
      required: false,
    },
    brand: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    category:{
      type:mongoose.Types.ObjectId,
      required:true
    },
    subCategory:{
      type:mongoose.Types.ObjectId,
      required:true
    },
    featured: {
      type: Boolean,
      required: false,
      default: false,
    },
    deletedAt: {
      type: Date,
      required: false,
    },
  },
  { timestamps: true }
);

export const ProductModel = mongoose.model("products", productSchema);
