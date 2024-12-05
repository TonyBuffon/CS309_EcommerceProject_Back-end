const { Router } = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const roleValidatorMiddleware = require("../middlewares/role-validator.middleware");
const { roles } = require("../enums/user.enum");
const productController = require("../controllers/product.controller");
const router = Router();

router.post(
  "/createProduct",
  authMiddleware,
  roleValidatorMiddleware(roles.Admin, roles.Seller),
  productController.createProduct
);

router.get("/getProduct", productController.getProduct);

router.get("/getAllProducts", productController.getAllProducts);

router.patch(
  "/updateProduct/:id",
  authMiddleware,
  roleValidatorMiddleware(roles.Admin, roles.Seller),
  productController.updateProduct
);

router.delete(
  "/deleteProduct/:id",
  authMiddleware,
  roleValidatorMiddleware(roles.Admin, roles.Seller),
  productController.deleteProduct
);

module.exports = router;
