const mongoose = require("mongoose");
const Order = require("../models/Orders");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const successSender = require("../utils/successSender");
const { roles } = require("../enums/user.enum");
const { orderStatus } = require("../enums/orderStatus.enum");
const Products = require("../models/Products");

exports.updateOrder = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  let filter =
    req.user.role === roles.Admin
      ? { _id: id }
      : {
          _id: id,
          "products.seller": req.user._id,
        };
  let order = await Order.findOne(filter);
  if (!order) return next(new AppError("order not found", 404));
  order = await Order.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  successSender(res, order, 200);
});

exports.createOrder = catchAsync(async (req, res, next) => {
  req.body.client = req.user._id;
  let session = await mongoose.startSession();
  session.startTransaction();
  try {
    let products = req.body.products;
    let totalAmount = 0;
    for (let i = 0; i < products.length; i++) {
      const product = Products.findById(products[i].product);
      if (!product) {
        await session.abortTransaction();
        return next(new AppError("product not found", 404));
      }
      if (product.quantity < products[i].quantity) {
        await session.abortTransaction();
        return next(new AppError("product out of stock", 400));
      }
      product.quantity -= products[i].quantity;
      totalAmount += product.price * products[i].quantity;
      await product.save({ session });
    }
    const order = await Order.create({
      ...req.body,
      status: orderStatus.Pending,
      totalAmount,
    });
    successSender(res, order, 201);
  } catch (err) {}
});

exports.cancelOrder = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;
  const order = await Order.findOne({ _id: id, client: userId });
  if (!order) {
    return next(new AppError("order not found", 404));
  }
  await Order.findOneAndUpdate({ _id: id }, { status: orderStatus.Canceled });
  successSender(res, undefined, 204);
});

exports.getMyOrders = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  let { page = 1, limit = 10 } = req.query;
  page = parseInt(page);
  limit = parseInt(limit);

  let filter =
    req.user.role === roles.User
      ? { client: userId }
      : {
          "products.seller": userId,
        };
  let order = await Order.find(filter)
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 });
  successSender(res, order, 200);
});

exports.getAllOrders = catchAsync(async (req, res) => {
  let { page = 1, limit = 10 } = req.query;
  page = parseInt(page);
  limit = parseInt(limit);

  const order = await Order.find()
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 });
  successSender(res, order, 200);
});
