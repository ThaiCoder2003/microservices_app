require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const app = express();
const port = process.env.PORT || 5002;

const connectDB = require('./config/db'); // Assuming you have a db.js file for MongoDB connection
const productRoutes =  require('./routes/productRoutes'); // Assuming you have a productController.js file

const startKafkaConsumer =  require('./infrastructure/kafka/product.consumer');
const { startProducer } = require('./infrastructure/kafka/product.producer');

connectDB();


// Register product routes
// Lấy danh sách user
const startServer = async () => {
  try {
    const app = express();
    app.use(express.json());
// Đăng ký
    app.use('/', productRoutes); ; 
    await connectDB();
    console.log('[MongoDB] Connected');
    require('./utils/seed');

    await startProducer();
    await startKafkaConsumer();
    console.log('[Kafka] Producer and Consumer started');

    app.listen(port, () => {
      console.log(`Product Service running on port ${port}`);
    });
  } catch (err) {
    console.error('[Startup Error]', err);
    process.exit(1); // Exit if critical infra fails
  }
}

startServer();