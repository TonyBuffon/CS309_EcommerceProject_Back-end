const ShoppingCart = require("../models/ShoppingCart");

const catchAsync = require("../utils/catchAsync");
const successSender = require("../utils/successSender");

exports.getShoppingCart = catchAsync(async (req, res) => {
  let { page = 1, limit = 10 } = req.query;
  page = parseInt(page);
  limit = parseInt(limit); // get is right?
  const cart = await ShoppingCart.find()
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 });
  successSender(res, cart, 200);
});

exports.addToShoppingCart = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  let cart = await ShoppingCart.findOne({ _id: id, client: userId });
  cart = await ShoppingCart.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  successSender(res, cart, 200);
});

exports.deleteFromShoppingCart = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;
  let cart = await ShoppingCart.findOne({ _id: id, client: userId });
  cart.products.pull({ product: id });
  await cart.save();
  successSender(res, cart, 200);
});
