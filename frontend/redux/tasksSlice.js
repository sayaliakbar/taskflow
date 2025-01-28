import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../api/axios";

// Async Thunks for API Requests
export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async () => {
  const response = await axios.get("/tasks");
  return response.data; // Assuming backend returns tasks array
});

export const createTask = createAsyncThunk("tasks/createTask", async (task) => {
  const response = await axios.post("/tasks", task);
  console.log(response);
  return response.data; // Assuming backend returns the created task
});

export const deleteTaskById = createAsyncThunk(
  "tasks/deleteTask",
  async (id) => {
    await axios.delete(`/tasks/${id}`);
    return id; // Return the ID of the deleted task
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
  reducers: {},
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
      });
  },
});

export default tasksSlice.reducer;
