const userRoutes = require("./user.routes");
const productRoutes = require("./product.routes");
const { Router } = require("express");

const appRouter = Router();
appRouter.use("/users", userRoutes);
appRouter.use("/products", productRoutes);

module.exports = appRouter;
