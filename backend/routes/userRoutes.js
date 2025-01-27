const express = require("express");

const router = express.Router();

const {
  getUsers,
  getUserById,
  deleteUserById,
  updateUserById,
} = require("../controllers/userController");

const {
  validateUser,
  validateUserByRole,
} = require("../middlewares/userValidationMiddleware");

const { verifyToken, verifyRole } = require("../middlewares/authMiddleware");

// Get all users
router.get("/", verifyToken, verifyRole(["admin"]), getUsers);

// Get a single user by ID
router.get("/:id", verifyToken, getUserById);

// Delete a user
router.delete("/:id", verifyToken, deleteUserById);

// Update a user by role
router.put(
  "/:id",
  verifyToken, // Verifies the JWT token
  validateUserByRole, // Handles role-based restrictions for updating fields
  validateUser, // Validates the request body
  updateUserById // Updates the user in the database
);

module.exports = router;
