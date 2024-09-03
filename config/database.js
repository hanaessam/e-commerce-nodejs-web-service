const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require("mongoose");

const dbConnection = () => {
  console.log(process.env.DB_URI);
  mongoose
    .connect(process.env.DB_URI)
    .then(() => {
      console.log(`Database connected`);
    }).catch((err) => {
      console.log(`Database connection error: ${err.message}`);
    });
  
};
module.exports = dbConnection;
