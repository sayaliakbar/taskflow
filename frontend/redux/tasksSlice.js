import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../api/axios";

// Async Thunks for API Requests
export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async () => {
  const response = await axios.get("/tasks");
  return response.data; // Assuming backend returns tasks array
});

export const createTask = createAsyncThunk("tasks/createTask", async (task) => {
  const response = await axios.post("/tasks", task);

  return response.data; // Assuming backend returns the created task
});

export const deleteTaskById = createAsyncThunk(
  "tasks/deleteTask",
  async (id) => {
    await axios.delete(`/tasks/${id}`);
    return id; // Return the ID of the deleted task
  }
);

export const updateTaskStatus = createAsyncThunk(
  "tasks/updateStatus",
  async ({ taskId, status }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/tasks/${taskId}/status`, { status });
      return { taskId, status }; // Assuming the backend returns the updated task
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Tasks Slice
const tasksSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [],
    status: "idle", // 'loading', 'succeeded', 'failed'
    error: null,
  },
  reducers: {
    taskUpdated: (state, action) => {
      const { taskId, status } = action.payload;
      const task = state.tasks.find((task) => task._id === taskId);
      if (task) {
        task.status = status; // Update the status of the specific task
      }
    },
    taskDeleted: (state, action) => {
      state.tasks = state.tasks.filter((task) => task._id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Tasks
      .addCase(fetchTasks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.tasks = action.payload.tasks;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Create Task
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })
      // Delete Task
      .addCase(deleteTaskById.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      })
      // Update Task Status
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        const { taskId, status } = action.payload;
        const task = state.tasks.find((task) => task._id === taskId);
        if (task) {
          task.status = status; // Update the status of the specific task
        }
      })
      .addCase(updateTaskStatus.rejected, (state, action) => {
        state.error = action.payload || "Failed to update task status";
      });
  },
});

export const { taskUpdated, taskDeleted } = tasksSlice.actions;

export default tasksSlice.reducer;
