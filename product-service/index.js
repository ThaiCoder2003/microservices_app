require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const app = express();
const port = process.env.PORT || 3002;

const connectDB = require('./config/db'); // Assuming you have a db.js file for MongoDB connection
const productRoutes =  require('./routes/productRoutes'); // Assuming you have a productController.js file

connectDB(); // Connect to MongoDB
app.use(express.json()); 

app.use('/', productRoutes); // Register product routes
// Lấy danh sách user
app.listen(port, () => {
  console.log(`User Service running on port ${port}`);
});
