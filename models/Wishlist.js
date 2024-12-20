const mongoose = require("mongoose");
const wishlistSchema = new mongoose.Schema(
  {
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: [true, "Please add a product"],
        },
      },
    ],
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please add a wishlist"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Wishlist = mongoose.model("wishlist", wishlistSchema);
module.exports = Wishlist;
