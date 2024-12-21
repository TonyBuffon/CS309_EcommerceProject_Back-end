const mongoose = require("mongoose");
const orderStatus = require("../enums/orderStatus.enum");

const OrdersSchema = new mongoose.Schema(
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
    address: {
      type: String,
      required: [true, "Please add an address"],
    },
    status: {
      type: String,
      enum: Object.values(orderStatus),
      default: orderStatus.Pending,
    },
    totalAmount: {
      type: Number,
      required: [true, "Please add the total amount"],
      min: 0,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

module.exports = mongoose.model("Orders", OrdersSchema);
