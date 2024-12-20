const Product = require("../models/Products");
const User = require("../models/User"); // Assuming a User model exists
const catchAsync = require("../utils/catchAsync");
const successSender = require("../utils/successSender");
const AppError = require("../utils/AppError");

exports.addToWishlist = catchAsync(async (req, res, next) => {
  const { id } = req.params; // Product ID
  const userId = req.user.id;

  const product = await Product.findById(id);
  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { $addToSet: { wishlist: id } },
    { new: true }
  );

  successSender(res, { wishlist: user.wishlist }, 200);
});

exports.deleteFromWishlist = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  const product = await Product.findById(id);
  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { $pull: { wishlist: id } },
    { new: true }
  );

  successSender(res, { wishlist: user.wishlist }, 200);
});

exports.getWishlist = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const user = await User.findById(userId).populate("wishlist");

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  successSender(res, { wishlist: user.wishlist }, 200);
});
