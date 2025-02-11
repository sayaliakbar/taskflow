const express = require("express");

const router = express.Router();

const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  updateTaskStatus,
} = require("../controllers/taskController");

const {
  validateTask,
  validateTaskStatus,
} = require("../middlewares/taskValidationMiddleware");

const { verifyToken, verifyRole } = require("../middlewares/authMiddleware");

// Create a new task
router.post("/", verifyToken, validateTask, verifyRole(["admin"]), createTask);

// Get all tasks
router.get("/", verifyToken, getTasks);

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

router.put(
  "/:id/status",
  verifyToken,
  verifyRole(["admin", "editor"]),
  validateTaskStatus,
  updateTaskStatus
);

module.exports = router;
