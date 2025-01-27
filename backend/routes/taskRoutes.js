const express = require("express");

const router = express.Router();

const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

const { validateTask } = require("../middlewares/taskValidationMiddleware");

const { verifyToken, verifyRole } = require("../middlewares/authMiddleware");

// Create a new task
router.post(
  "/",
  verifyToken,
  validateTask,
  verifyRole(["admin", "editor"]),
  createTask
);

// Get all tasks
router.get("/", verifyToken, verifyRole(["admin", "editor"]), getTasks);

// Get a single task by ID
router.get("/:id", verifyToken, getTaskById);

// Update a task
router.put(
  "/:id",
  verifyToken,
  validateTask,
  verifyRole(["admin", "editor"]),
  updateTask
);

// Delete a task
router.delete("/:id", verifyToken, verifyRole(["admin"]), deleteTask);

module.exports = router;
