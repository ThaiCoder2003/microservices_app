// user-service/index.js
require('dotenv').config();
const express = require('express');
const userRoutes = require('./routes/userRoutes'); // Assuming you have a userRoutes.js file
const connectDB = require('./config/db'); // Assuming you have a db.js file for MongoDB connection
const startKafkaConsumer =  require('./infrastructure/kafka/user.consumer');
const { startProducer } = require('./infrastructure/kafka/user.producer');

const port = process.env.PORT || 5001;

// Register user routes
// Lấy danh sách user

const startServer = async () => {
  try {
    const app = express();
    app.use(express.json());
// Đăng ký
    app.use('/', userRoutes); 
    await connectDB();
    console.log('[MongoDB] Connected');

    await startProducer();
    await startKafkaConsumer();
    console.log('[Kafka] Producer and Consumer started');

    app.listen(port, () => {
      console.log(`User Service running on port ${port}`);
    });
  } catch (err) {
    console.error('[Startup Error]', err);
    process.exit(1); // Exit if critical infra fails
  }
}

startServer();
