const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const mongoose = require("mongoose");
const dbConnection = require("./config/database");
const categoryRoutes = require("./routes/categoryRoutes");
const subCategoryRoutes = require("./routes/subCategoryRoutes");
const brandRoutes = require("./routes/brandRoutes");
const ErrorHandler = require("./utils/ErrorHandler");
const globalErrorMiddlewareHandler = require("./middlewares/errorMiddleware");

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

// mounting routes 
app.use("/api/v1/categories/", categoryRoutes);
app.use("/api/v1/sub-categories/", subCategoryRoutes); 
app.use("/api/v1/brands/", brandRoutes);

app.all("*", (req, res, next) => {
  // Create error and send to the global error handler middleware
  next(new ErrorHandler(400, `Can't find this route: ${req.originalUrl}`));
});

// Global error handling middleware
app.use(globalErrorMiddlewareHandler);

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle rejcected promises (outside of express)
process.on("unhandledRejection", (err) => {
  console.error(`Unhandled Rejection Error: ${err.name} : ${err.message}`);
  server.close(() => {
    console.error("Shutting down due to unhandled promise rejection...");
    process.exit(1);
  });
});
