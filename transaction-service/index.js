require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const app = express();
const port = process.env.PORT || 5003;

const connectDB = require('./config/db');

const cartRoute = require('./interfaces/http/cartRoute');
const receiptRoute = require('./interfaces/http/receiptRoute');

connectDB();

app.use(express.json());

app.use('/cart', cartRoute);
app.use('/receipt', receiptRoute);

app.listen(port, () => {
  console.log(`User Service running on port ${port}`);
});