const userRoutes = require("./user.routes");
const { Router } = require("express");

const appRouter = Router();
appRouter.use("/users", userRoutes);

module.exports = appRouter;
