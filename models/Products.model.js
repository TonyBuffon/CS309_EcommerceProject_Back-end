const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    title: { type: String, required: [true, "Please add a title"] },
    description: {
      type: String,
      unique: true,
      required: [true, "Please add a description"],
    },
    price: { type: String, required: [true, "Please add a price"] },
    quantitiy: { type: String, required: [true, "Please add a quantitiy"] },
    image: { type: String, required: [true, "Please add a image"] },
    seller: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please add a seller"],
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Product", productSchema);
