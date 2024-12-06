const { Router } = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const roleValidatorMiddleware = require("../middlewares/role-validator.middleware");
const { roles } = require("../enums/user.enum");
const OrdersController = require("../controllers/orders.controller");
const router = Router();

router.post(
    '/Orders/update',
    authMiddleware,
    roleValidatorMiddleware(roles.Admin,roles.Seller),
    OrdersController.updateOrder
);

router.post(
    '/Orders/cancel',
    authMiddleware,
    OrdersController.cancelOrder
);

router.post(
    '/Orders/myOrders',
    authMiddleware,
    roleValidatorMiddleware(roles.User , roles.Seller),
    OrdersController.getMyOrders
);

router.post(
    '/Orders',
    authMiddleware,
    roleValidatorMiddleware(roles.Admin),
    OrdersController.getAllOrders
);

module.exports = router;