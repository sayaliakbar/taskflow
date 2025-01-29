const { body, validationResult } = require("express-validator");

const { CustomError } = require("./errorMiddleware");

const validateTask = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .bail()
    .isLength({ max: 50 })
    .withMessage("Title must not exceed 50 characters"),

  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .bail()
    .isLength({ max: 500 })
    .withMessage("Description must not exceed 500 characters"),

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

const validateTaskStatus = [
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .bail()
    .isIn(["To-Do", "In Progress", "Done"])
    .withMessage("Status must be one of 'To-Do', 'In Progress', 'Done'"),

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

module.exports = { validateTask, validateTaskStatus };
