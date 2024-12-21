const mongoose = require("mongoose");

const shoppingCartSchema = new mongoose.Schema(
  {
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: [true, "Please add a product"],
        },
        quantity: {
          type: Number,
          required: [true, "Please add a quantity"],
          min: [1, "Quantity must be at least 1"],
        },
      },
    ],

    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please add a user"],
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

module.exports = mongoose.model("ShoppingCart", shoppingCartSchema);
