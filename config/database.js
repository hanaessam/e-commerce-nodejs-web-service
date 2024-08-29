const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();


const dbConnection = () => {
  
  mongoose
    .connect(process.env.DB_URI)
    .then(() => {
      console.log(`Database connected`);
    })
  
};
module.exports = dbConnection;
