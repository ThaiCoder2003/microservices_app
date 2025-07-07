// user-service/index.js
require('dotenv').config();
const express = require('express');
const userRoutes = require('./routes/userRoutes'); // Assuming you have a userRoutes.js file
const connectDB = require('./config/db'); // Assuming you have a db.js file for MongoDB connection

const app = express();
const port = process.env.PORT || 5001;

connectDB(); // Connect to MongoDB
app.use(express.json());
// Đăng ký
app.use('/', userRoutes); // Register user routes
// Lấy danh sách user
app.listen(port, () => {
  console.log(`User Service running on port ${port}`);
});
