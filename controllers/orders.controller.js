const Order = require("../models/Orders");

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const successSender = require("../utils/successSender");
const { roles } = require("../enums/user.enum");

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

exports.cancelOrder = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;
  const order = await Order.findOne({ _id: id, client: userId });
  if (!order) {
    return next(new AppError("order not found", 404));
  }
  await Order.findByIdAndDelete(id);
  successSender(res, undefined, 204);
});

exports.getMyOrders = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;
  let filter =
    req.user.role === roles.User
      ? { client: userId }
      : {
          "products.seller": userId,
        };
  let order = await Order.filter(filter);
  successSender(res, order, 200);
});

exports.getAllOrders = catchAsync(async (req, res) => {
  let { page = 1, limit = 10 } = req.query;
  page = parseInt(page);
  limit = parseInt(limit);
  const { id } = req.params;
  const order = await Order.find()
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 });
  successSender(res, order, 200);
});
