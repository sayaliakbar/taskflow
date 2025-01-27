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

const { verifyToken } = require("../middlewares/authMiddleware");

// Create a new task
router.post("/", verifyToken, validateTask, createTask);

// Get all tasks
router.get("/", verifyToken, getTasks);

// Get a single task by ID
router.get("/:id", verifyToken, getTaskById);

// Update a task
router.put("/:id", verifyToken, validateTask, updateTask);

// Delete a task
router.delete("/:id", verifyToken, deleteTask);

module.exports = router;
