const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const morgan = require("morgan");
const connectDB = require("./config/db");
const { errorHandler, CustomError } = require("./middlewares/errorMiddleware");
const cors = require("cors");

connectDB();

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  throw new CustomError(
    "MONGO_URI and JWT_SECRET must be provided in .env file",
    500
  );
}

app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173", // Development origin
      //   "http://localhost:4173", // Development frontend
      //   "https://minisocial-frontend.vercel.app", // Production frontend
    ],
    credentials: true,
  })
);

app.use("/api/auth", require("./routes/authRoutes"));

app.get("/", (req, res) => {
  res.send("API is working!");
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
