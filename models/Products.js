const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a title"],
      minlength: 3,
    },
    description: {
      type: String,
      unique: true,
      required: [true, "Please add a description"],
      minlength: 3,
    },
    price: { type: String, required: [true, "Please add a price"], min: 0 },
    quantity: {
      type: String,
      required: [true, "Please add a quantity"],
      min: 0,
    },
    image: { type: String, required: [true, "Please add a image"] },
    seller: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please add a seller"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
module.exports = mongoose.model("Product", productSchema);
