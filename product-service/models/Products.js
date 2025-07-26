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
        type: String,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    category: {
        type: String,
        enum: ['Cà phê', 'Trà', 'Bánh ngọt', 'Nước ép'],
        default: 'Cà phê',
        required: true,
    },
    description: {
        type: String,
    },
});

module.exports = mongoose.model('Product', ProductSchema);