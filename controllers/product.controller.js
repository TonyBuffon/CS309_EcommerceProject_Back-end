const Product = require("../models/Products.model");

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const successSender = require("../utils/successSender");

const { roles } = require("../enums/user.enum");

exports.createProduct = catchAsync(async (req, res, next) => {
  const product = await Product.create({
    ...req.body,
    seller: req.user.id,
  });
  successSender(res, product, 201);
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  let filter =
    req.user.role === roles.Admin
      ? { _id: id }
      : {
          _id: id,
          seller: req.user.id,
        };
  let product = await Product.findOne(filter);
  if (!product) return next(new AppError("product not found", 404));
  product = await Product.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  // res.status(200).json(product);
  successSender(res, product, 200);
});

exports.getProduct = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) return next(new AppError("product not found", 404));
  // res.status(200).json({ product, status: "success" });
  successSender(res, product, 200);
});

exports.getAllProducts = catchAsync(async (req, res) => {
  let { page = 1, limit = 10 } = req.query;
  page = parseInt(page);
  limit = parseInt(limit);
  const products = await Product.find()
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 });
  successSender(res, products, 200);
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const filter =
    req.user.role === roles.Admin
      ? { _id: id }
      : { _id: id, seller: req.user.id };
  const product = await Product.findOne(filter);
  if (!product) {
    return next(new AppError("product not found", 404));
  }
  await Product.findByIdAndDelete(id);
  successSender(res, undefined, 204);
  // res.status(200).json({ product, status: "success" });
});
