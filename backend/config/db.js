const mongoose = require("mongoose");
const { CustomError } = require("../middlewares/errorMiddleware");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.NODE_ENV === "development"
        ? process.env.MONGO_URI_DEV
        : process.env.MONGO_URI
    );

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new CustomError("Database connection failed", 500, error.message);
  }
};

module.exports = connectDB;
