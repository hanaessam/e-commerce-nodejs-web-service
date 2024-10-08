const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const compression = require("compression");

dotenv.config({ path: "./config.env" });

const APIError = require("./utils/APIError");
const globalError = require("./middlewares/errorMiddleware");
const dbConnection = require("./config/database");
const mountRoutes = require("./routes");

const { webhookCheckout } = require("./controllers/orderController");

// Connect with db
dbConnection();

// express app
const app = express();

// Enable CORS
app.use(cors());
app.options("*", cors());

// Enable response compression
app.use(compression());

// Checkout webhook
app.post("/api/v1/checkout-webhook", express.raw({ type: "application/json" }), webhookCheckout);

// Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}


// Add a default route for the root URL
app.get("/", (req, res) => {
  res.send("Welcome to the API");
});
// Mount Routes
mountRoutes(app);




app.all("*", (req, res, next) => {
  next(new APIError(`Can't find this route: ${req.originalUrl}`, 400));
});

// Global error handling middleware for express
app.use(globalError);

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`App running running on port ${PORT}`);
});

// Handle rejection outside express
process.on("unhandledRejection", (err) => {
  console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error(`Shutting down....`);
    process.exit(1);
  });
});
