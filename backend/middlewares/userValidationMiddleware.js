const { body, validationResult } = require("express-validator");
const { CustomError } = require("./errorMiddleware");

const validateUser = [
  body("name")
    .optional() // Make this optional since not all fields might be updated
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
    .optional() // Same here
    .notEmpty()
    .withMessage("Email is required")
    .bail()
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail({ all_lowercase: true, gmail_remove_dots: false })
    .isLength({ max: 50 })
    .withMessage("Email must not exceed 50 characters"),

  body("role")
    .optional() // Admins might update this, so it's optional
    .notEmpty()
    .withMessage("Role is required")
    .bail()
    .isIn(["admin", "viewer", "editor"])
    .withMessage("Role must be either 'admin', 'viewer', or 'editor'"),

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

const validateUserByRole = (req, res, next) => {
  const { role } = req.body;

  // Admins can update all fields, including the role
  if (req.user.role === "admin") {
    return next();
  }

  // Viewers and Editors can only update their own name and email
  if (req.user.role === "viewer" || req.user.role === "editor") {
    if (req.user.id === req.params.id) {
      // Prevent updating the role
      if (role) {
        const error = new CustomError("Unauthorized to update role", 403);
        return next(error);
      }
      return next();
    }
  }

  // If none of the above conditions are met, deny access
  const error = new CustomError("Unauthorized", 401);
  return next(error);
};

module.exports = { validateUser, validateUserByRole };
