const { Router } = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const roleValidatorMiddleware = require("../middlewares/role-validator.middleware");
const { roles } = require("../enums/user.enum");
const ShoppingCartController = require("../controllers/shoppingCart.controller");
const router = Router();

router.post(
    '/myShoppingCart',
    authMiddleware,
    roleValidatorMiddleware(roles.User),
    ShoppingCartController.getShoppingCart
);

router.post(
    '/addToShoppingCart',
    authMiddleware,
    roleValidatorMiddleware(roles.User),
    ShoppingCartController.addToShoppingCart
);

router.post(
    '/deleteFromShoppingCart',
    authMiddleware,
    roleValidatorMiddleware(roles.User),
    ShoppingCartController.deleteFromShoppingCart
);

module.exports = router;
