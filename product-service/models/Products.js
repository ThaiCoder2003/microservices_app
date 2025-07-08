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
    stock: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    category: {
        type: String,
        enum: ['coffee', 'tea', 'snack', 'other'],
        default: 'other',
        required: true,
    },
    description: {
        type: String,
    },
});

module.exports = mongoose.model('Product', ProductSchema);