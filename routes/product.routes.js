const userController = require("../controllers/product.controller");
const { Router } = require("express");

const router = Router();

router.post("/createProduct", productController.createProduct);

router.get("/getProduct", productController.getProduct);

router.get("/getAllProducts", productController.getAllProducts);

router.patch("/updateProduct/:id", productController.updateProduct);

router.delete("/deleteProduct/:id", productController.deleteProduct);

module.exports = router;
