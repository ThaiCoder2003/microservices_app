const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    origin: {
        type: Number,
        default: 'Việt Nam',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    category: {
        type: String,
        enum: ['Cà phê', 'Trà', 'Đồ ăn vặt', 'Khác'],
        default: 'Khác',
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
});

module.exports = mongoose.model('Product', ProductSchema);