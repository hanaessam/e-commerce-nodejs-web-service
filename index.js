const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const mongoose = require("mongoose");
const dbConnection = require("./config/database");
const categoryRoutes = require("./routes/categoryRoutes");
const ErrorHandler = require("./utils/ErrorHandler");
const globalMiddlewareHandler = require("./middlewares/errorMiddleware");
dotenv.config();

// Database connection
dbConnection();

const app = express();

// Middlewares
app.use(express.json());
// Logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

// Routes
app.get("/", (req, res) => {
  res.send("Helloooo World!");
});

app.use("/api/v1/categories/", categoryRoutes);
app.all("*", (req, res, next) => {
  // Create error and send to the global error handler middleware
  next(new ErrorHandler(400,`Can't find this route: ${req.originalUrl}`));
});

// Global error handling middleware
app.use(globalMiddlewareHandler);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
