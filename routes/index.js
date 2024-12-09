const { Router } = require("express");

const userRoutes = require("./user.routes");
const productRoutes = require("./product.routes");
const orderRoutes = require("./order.routes");
const shoppingCartRoutes = require("./shoppingCart.routes");

const appRouter = Router();

appRouter.use("/users", userRoutes);
appRouter.use("/products", productRoutes);
appRouter.use("/orders", orderRoutes);
appRouter.use("/shoppingCart", shoppingCartRoutes);
module.exports = appRouter;
