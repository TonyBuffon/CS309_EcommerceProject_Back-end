const userController = require("../controllers/user.controller");
const { Router } = require("express");

const router = Router();

router.post("/signup", userController.signup);

router.post("/login", userController.login);

router.get("/me", userController.getMe);

router.patch("/update", userController.updateUser);

router.delete("/delete", userController.deleteUser);

router.get("/:id", userController.getUser);

router.get("/", userController.getAllUsers);

module.exports = router;
