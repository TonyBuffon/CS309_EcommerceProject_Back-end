const Product = require("../models/Products");
const User = require("../models/User"); // Assuming a User model exists
const catchAsync = require("../utils/catchAsync");
const successSender = require("../utils/successSender");
const AppError = require("../utils/AppError");
const Wishlist = require("../models/Wishlist");

exports.addToWishlist = catchAsync(async (req, res, next) => {
  const { productId } = req.body; // Product ID

  const product = await Product.findById(productId);
  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  const wishlist = await Wishlist.create({
    product: productId,
    client: req.user.id,
  });

  successSender(res, { wishlist: wishlist }, 200);
});

exports.deleteFromWishlist = catchAsync(async (req, res, next) => {
  const { id } = req.params; // Product Id
  const userId = req.user.id;

  const product = await Product.findById(id);
  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  const wishlist = await Wishlist.findOne({ product: id, client: userId });
  if (!wishlist) return next(new AppError("Wishlist not found", 404));

  await Wishlist.findByIdAndDelete(wishlist._id);
  successSender(res, { wishlist: wishlist }, 204);
});

exports.getMyWishlist = catchAsync(async (req, res) => {
  const userId = req.user.id;

  // const user = await User.findById(userId).populate("wishlist");
  const wishlists = await Wishlist.find({ client: userId });

  successSender(res, { wishlists }, 200);
});
