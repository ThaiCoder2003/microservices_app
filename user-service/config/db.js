const mongoose = require('mongoose');

// Sử dụng biến môi trường DB_URL đã được cấu hình trong docker-compose.yml
const dbURI = process.env.DB_URL
const connectDB = async () => {
    try {
        await mongoose.connect(dbURI);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        // Thoát khỏi quy trình với lỗi
        process.exit(1); 
    }
}

module.exports = connectDB;
