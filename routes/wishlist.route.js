const { Router } = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const roleValidatorMiddleware = require("../middlewares/role-validator.middleware");
const { roles } = require("../enums/user.enum");
const wishlistController = require("../controllers/wishlist.controller");
const router = Router();

module.exports = router;

router.post(
  "/addToWishlist/:id",
  authMiddleware,
  roleValidatorMiddleware(roles.User),
  wishlistController.addToWishlist
);

router.delete(
  "/deleteFromWishlist/:id",
  authMiddleware,
  roleValidatorMiddleware(roles.User),
  wishlistController.deleteFromWishlist
);

router.get(
  "/getWishlist",
  authMiddleware,
  roleValidatorMiddleware(roles.User),
  wishlistController.getWishlist
);
