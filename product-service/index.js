require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const app = express();
const port = process.env.PORT || 5002;
const seed = require('./utils/seed')

const connectDB = require('./config/db'); // Assuming you have a db.js file for MongoDB connection
const productRoutes =  require('./routes/productRoutes'); // Assuming you have a productController.js file

connectDB().then(() => {
    console.log('✅ Connected to MongoDB');
    return seedProducts();
  })
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ MongoDB connection or seeding failed:', err);
    process.exit(1);
  }); // Connect to MongoDB
app.use(express.json()); 

app.use('/', productRoutes); // Register product routes
// Lấy danh sách user
app.listen(port, () => {
  console.log(`User Service running on port ${port}`);
});
