const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const morgan = require("morgan");
const connectDB = require("../config/db");

const { createServer } = require("http");
const { Server } = require("socket.io");

const { errorHandler, CustomError } = require("../middlewares/errorMiddleware");

const cors = require("cors");

connectDB();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
  },
});

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  console.error("MONGO_URI and JWT_SECRET must be provided in .env file");
  process.exit(1); // Exit process if critical environment variables are missing
}

app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:3000", // Development origin
    ],
    credentials: true,
  })
);

app.use("/api/auth", require("../routes/authRoutes"));
app.use("/api/tasks", require("../routes/taskRoutes"));
app.use("/api/users", require("../routes/userRoutes"));

// Example route
app.get("/", (req, res) => {
  res.send("API is working!");
});

io.on("connection", (socket) => {
  console.log("New client connected", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

app.set("io", io);

// Error handling middleware
app.use((req, res, next) => {
  const error = new CustomError("Not found", 404);
  next(error);
});

app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
