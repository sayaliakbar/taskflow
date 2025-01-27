const Task = require("../models/Task");

const createTask = async (req, res) => {
  const { title, description, status, assignedTo, dueDate } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }

  try {
    const task = new Task({
      title,
      description,
      status,
      assignedTo,
      dueDate,
      createdBy: req.user.id, // The user who created the task
    });

    await task.save();
    res.status(201).json(task);

    const io = req.app.get("io");
    // Emit taskCreated event
    io.emit("taskCreated", task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating task", error });
  }
};

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");
    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching tasks", error });
  }
};

const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    if (!task) return res.status(404).json({ message: "Task not found" });

    res.status(200).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching task", error });
  }
};

const updateTask = async (req, res) => {
  const { title, description, status, assignedTo, dueDate } = req.body;

  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Update fields
    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;
    task.assignedTo = assignedTo || task.assignedTo;
    task.dueDate = dueDate || task.dueDate;

    await task.save();

    // Send the response first
    res.status(200).json(task);

    const io = req.app.get("io");

    // Emit the update event after response
    io.emit("taskUpdated", task);
  } catch (error) {
    // Ensure no additional response is sent if headers have already been set
    if (!res.headersSent) {
      res.status(500).json({ message: "Error updating task", error });
    }
    console.error(error);
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully" });

    const io = req.app.get("io");
    // Emit taskDeleted event
    io.emit("taskDeleted", task);
  } catch (error) {
    // Ensure no additional response is sent if headers have already been set
    if (!res.headersSent) {
      res.status(500).json({ message: "Error updating task", error });
    }
    console.error(error);
  }
};

module.exports = { createTask, getTasks, getTaskById, updateTask, deleteTask };
