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
      createdBy: req.user.id,
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
    let {
      page = 1,
      limit = 10,
      search = "",
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    if (page <= 0 || limit <= 0) {
      return res
        .status(400)
        .json({ message: "Page and limit must be positive integers" });
    }

    const order = sortOrder === "asc" ? 1 : sortOrder === "desc" ? -1 : null;
    if (order === null) {
      return res
        .status(400)
        .json({ message: "sortOrder must be either 'asc' or 'desc'" });
    }

    const validSortFields = ["createdAt", "title", "status", "dueDate"];
    if (!validSortFields.includes(sortBy)) {
      return res.status(400).json({
        message: `sortBy must be one of the following: ${validSortFields.join(
          ", "
        )}`,
      });
    }

    const searchQuery = search
      ? {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const tasks = await Task.find(searchQuery)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .sort({ [sortBy]: order })
      .limit(limit)
      .skip((page - 1) * limit);

    const totalTasks = await Task.countDocuments(searchQuery);

    res.status(200).json({
      tasks,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalTasks / limit),
        totalTasks,
      },
    });
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

    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;
    task.assignedTo = assignedTo || task.assignedTo;
    task.dueDate = dueDate || task.dueDate;

    await task.save();

    res.status(200).json(task);

    const io = req.app.get("io");

    io.emit("taskUpdated", task);
  } catch (error) {
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

    io.emit("taskDeleted", task);
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({ message: "Error updating task", error });
    }
    console.error(error);
  }
};

module.exports = { createTask, getTasks, getTaskById, updateTask, deleteTask };
