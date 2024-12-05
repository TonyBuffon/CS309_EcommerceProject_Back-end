const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const User = require("../models/User");
const AppError = require("./../utils/AppError");
const catchAsync = require("./../utils/catchAsync");

export default catchAsync(async (req, res, next) => {
  // 1) Getting token and check if it's exist
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer") &&
    req.headers.authorization.split(" ")[1]
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }
  // 2) Verification token
  // @ts-ignore
  // @ts-nocheck
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }

  //  GRANT ACCESS TO PROTECTED ROUTES
  req.user = currentUser;
  next();
});
