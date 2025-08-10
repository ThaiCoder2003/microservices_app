require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const startKafkaConsumer = require('./infrastructure/kafka/transaction.consumer');
const { startProducer } = require('./infrastructure/kafka/transaction.producer');

const port = process.env.PORT || 5003;

const connectDB = require('./config/db');

const cartRoute = require('./interfaces/http/cartRoute');
const receiptRoute = require('./interfaces/http/receiptRoute');

async function start() {
  try {
    const app = express();
    connectDB();

    app.use(express.json());

    await startProducer();
    await startKafkaConsumer();

    app.use('/cart', cartRoute);
    app.use('/receipt', receiptRoute);

    app.listen(port, () => {
      console.log(`User Service running on port ${port}`);
});
  }

  catch (err) {
    console.error('Service failed to start:', err);
    process.exit(1);
  }
}

start();