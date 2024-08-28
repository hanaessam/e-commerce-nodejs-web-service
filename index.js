const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const mongoose = require('mongoose');
const dbConnection = require('./config/database');
const categoryRoutes = require('./routes/categoryRoutes');

dotenv.config();





// Database connection
dbConnection();

const app = express();


// Middlewares
app.use(express.json());
// Logging middleware
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
    console.log(`mode: ${process.env.NODE_ENV}`);
    
}



// Routes
app.get('/', (req, res) => {
    res.send('Helloooo World!');
    }
);

app.use('/api/v1/categories/', categoryRoutes);


const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    }
);  