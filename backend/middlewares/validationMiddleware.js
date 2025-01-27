const { body, validationResult } = require("express-validator");

const { CustomError } = require("./errorMiddleware");

const validateRegister = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .bail()
    .isLength({ min: 2, max: 30 })
    .withMessage("Name must be between 2 and 30 characters")
    .matches(/^[A-Za-z\s'-]+$/)
    .withMessage(
      "Name must only contain letters, spaces, apostrophes, or hyphens"
    ),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .bail()
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail({ all_lowercase: true, gmail_remove_dots: false })
    .isLength({ max: 50 })
    .withMessage("Email must not exceed 50 characters"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .bail()
    .isLength({ min: 6, max: 50 })
    .withMessage("Password must be between 6 and 50 characters")
    .matches(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[@#$%^&+=!])[A-Za-z0-9@#$%^&+=!]+$/
    )
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@, #, $, %, ^, &, +, =, !)"
    ),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new CustomError("Validation failed", 400);
      error.errors = errors.array();
      return next(error);
    }
    next();
  },
];

const validateLogin = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .bail()
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail({ all_lowercase: true, gmail_remove_dots: false })
    .isLength({ max: 50 })
    .withMessage("Email must not exceed 50 characters"),

  body("password").notEmpty().withMessage("Password is required").bail(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new CustomError("Validation failed", 400);
      error.errors = errors.array();
      return next(error);
    }
    next();
  },
];

const validateForgotPassword = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .bail()
    .isEmail()
    .withMessage("Invalid email format")
    .bail()
    .normalizeEmail({ all_lowercase: true, gmail_remove_dots: false })
    .isLength({ max: 50 })
    .withMessage("Email must not exceed 50 characters")
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    .withMessage("Email contains invalid characters"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new CustomError("Validation failed", 400);
      error.errors = errors.array();
      return next(error);
    }
    next();
  },
];

const validateResetPassword = [
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .bail()
    .isLength({ min: 6, max: 50 })
    .withMessage("Password must be between 6 and 50 characters")
    .matches(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[@#$%^&+=!])[A-Za-z0-9@#$%^&+=!]+$/
    )
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@, #, $, %, ^, &, +, =, !)"
    ),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new CustomError("Validation failed", 400);
      error.errors = errors.array();
      return next(error);
    }
    next();
  },
];

module.exports = {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
};
