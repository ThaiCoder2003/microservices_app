require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const app = express();
const port = process.env.PORT || 5002;
const seed = require('./utils/seed')

const connectDB = require('./config/db'); // Assuming you have a db.js file for MongoDB connection
const productRoutes =  require('./routes/productRoutes'); // Assuming you have a productController.js file

connectDB();
app.use(express.json()); 

app.use('/', productRoutes); // Register product routes
// Lấy danh sách user
app.listen(port, () => {
  console.log(`Product Service running on port ${port}`);
});
