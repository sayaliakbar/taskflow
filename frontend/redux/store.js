import { configureStore } from "@reduxjs/toolkit";
import tasksReducer from "./tasksSlice";
import authReducer from "./authSlice";
import usersReducer from "./usersSlice";

const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    auth: authReducer,
    users: usersReducer,
  },
});

export default store;
