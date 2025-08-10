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
    image: {
        type: String,
        required: true,
        default: 'default_product.png'
    },
    price: {
        type: Number,
        required: true,
    },
    origin: {
        type: String,
        default: 'Việt Nam',
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