require("dotenv").config({ path: "./.env" });
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const appRouter = require("./routes");
const errorHandler = require("./utils/errorHandler");
const AppError = require("./utils/AppError");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1", appRouter);
app.all("*", (req, res, next) => {
  return next(new AppError(`Couldn't find this route ${req.originalUrl}`, 404));
});

app.use(errorHandler);
mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log("DB connection successful");
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
});
