const User = require("../models/User");
const jwt = require("jsonwebtoken");

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const successSender = require("../utils/successSender");
const { roles } = require("../enums/user.enum");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_AFTER,
  });
};

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.checkPassword(password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  const token = signToken(user._id);

  successSender(res, { user: user, token }, 200);
});

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({ ...req.body, role: roles.User });
  const token = signToken(newUser._id);

  successSender(res, { user: newUser, token }, 201);
});

exports.getMe = catchAsync(async (req, res, next) => {
  successSender(res, req.user, 200);
});

exports.updateMe = catchAsync(async (req, res, next) => {
  delete req.body.role;
  const user = await User.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
    runValidators: true,
  });

  successSender(res, user, 200);
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;
  const { role } = req.query;
  page = parseInt(page);
  limit = parseInt(limit);
  const filter = role ? { role } : {};
  const users = await User.find(filter)
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 });
  successSender(res, users, 200);
});

exports.createUser = catchAsync(async (req, res, next) => {
  const user = await User.create(req.body);
  successSender(res, user, 201);
});

exports.getUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);
  successSender(res, user, 200);
});
// delete him
exports.deleteUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    return next(new AppError("No user found with that ID", 404));
  }
  await User.findByIdAndDelete(id);
  successSender(res, user, 204);
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findBy(id);
  if (!user) {
    return next(new AppError("No user found with that ID", 404));
  }
  await User.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  successSender(res, user, 200);
});
