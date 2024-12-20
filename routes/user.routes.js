const { Router } = require("express");
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const roleValidatorMiddleware = require("../middlewares/role-validator.middleware");

const { roles } = require("../enums/user.enum");

const router = Router();

router.post("/signup", userController.signup);

router.post("/login", userController.login);

router.get("/me", authMiddleware, userController.getMe);
router.patch("/me", authMiddleware, userController.updateMe);

router.patch(
  "/update/:id",
  authMiddleware,
  roleValidatorMiddleware(roles.Admin),
  userController.updateUser
);

router.delete(
  "/delete/:id",
  authMiddleware,
  roleValidatorMiddleware(roles.Admin),
  userController.deleteUser
);

router.get(
  "/one/:id",
  authMiddleware,
  roleValidatorMiddleware(roles.Admin),
  userController.getUser
);

router.get(
  "/",
  authMiddleware,
  roleValidatorMiddleware(roles.Admin),
  userController.getAllUsers
);

router.post("/forgotPassword", userController.forgetPassword);

router.patch("/resetPassword/:token", userController.resetPassword);
module.exports = router;
