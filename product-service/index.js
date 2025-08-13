require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 5002;

const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const startKafkaConsumer = require('./infrastructure/kafka/product.consumer');
const { startProducer } = require('./infrastructure/kafka/product.producer');
const seedProducts = require('./utils/seed'); // Sửa lại: chỉ import hàm seedProducts

const startServer = async () => {
    try {
        await connectDB();
        console.log('[MongoDB] Connected');

        // Chạy seeding sau khi đã kết nối MongoDB
        await seedProducts();
        
        // Khởi động Kafka
        await startProducer();
        await startKafkaConsumer();
        console.log('[Kafka] Producer and Consumer started');

        // Cấu hình Express
        app.use(express.json());
        app.use('/', productRoutes);
        
        app.listen(port, () => {
            console.log(`Product Service running on port ${port}`);
        });
    } catch (err) {
        console.error('[Startup Error]', err);
        process.exit(1);
    }
}

startServer();
