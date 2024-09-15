const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');


const APIError = require('./utils/APIError');
const globalError = require('./middlewares/errorMiddleware');
const dbConnection = require('./config/database');
// Routes
const categoryRoute = require('./routes/categoryRoutes');
const subCategoryRoute = require('./routes/subCategoryRoutes');
const brandRoute = require('./routes/brandRoutes');
const productRoute = require('./routes/productRoutes');
const userRoute = require('./routes/userRoutes');
const authRoute = require('./routes/authRoutes')


dotenv.config({ path: './config.env' });

// Connect with db
dbConnection();

// express app
const app = express();

// Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, 'uploads')));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

// Mount Routes
app.use('/api/v1/categories', categoryRoute);
app.use('/api/v1/sub-categories', subCategoryRoute);
app.use('/api/v1/brands', brandRoute);
app.use('/api/v1/products', productRoute);

app.use('/api/v1/users', userRoute);
app.use('/api/v1/auth', authRoute);

app.all('*', (req, res, next) => {
  next(new APIError(`Can't find this route: ${req.originalUrl}`, 400));
});

// Global error handling middleware for express
app.use(globalError);

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`App running running on port ${PORT}`);
});

// Handle rejection outside express
process.on('unhandledRejection', (err) => {
  console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error(`Shutting down....`);
    process.exit(1);
  });
});
