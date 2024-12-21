const { Router } = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const roleValidatorMiddleware = require("../middlewares/role-validator.middleware");
const { roles } = require("../enums/user.enum");
const OrdersController = require("../controllers/orders.controller");
const router = Router();

router.patch(
  "/update",
  authMiddleware,
  roleValidatorMiddleware(roles.Admin, roles.Seller),
  OrdersController.updateOrder
);

router.delete("/cancel", authMiddleware, OrdersController.cancelOrder);

router.get(
  "/mine",
  authMiddleware,
  roleValidatorMiddleware(roles.User, roles.Seller),
  OrdersController.getMyOrders
);

router.get(
  "/",
  authMiddleware,
  roleValidatorMiddleware(roles.Admin),
  OrdersController.getAllOrders
);

router.post(
  "/",
  authMiddleware,
  roleValidatorMiddleware(roles.User, roles.Seller),
  OrdersController.createOrder
);

module.exports = router;
