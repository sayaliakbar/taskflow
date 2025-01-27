const express = require("express");

const {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
} = require("../middlewares/validationMiddleware");

const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

const router = express.Router();

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.post("/register", validateRegister, asyncHandler(registerUser));

router.post("/login", validateLogin, asyncHandler(loginUser));

router.post(
  "/forgot-password",
  validateForgotPassword,
  asyncHandler(forgotPassword)
);

router.post(
  "/reset-password",
  validateResetPassword,
  asyncHandler(resetPassword)
);

module.exports = router;
