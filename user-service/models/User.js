const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },

    profilePicture: {
        type: String,
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },

    birthday: {
        type: Date,
    },

    address: {
        type: String,
    },

    phone: {
        type: String,
    },

    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
});

module.exports = mongoose.model('User', UserSchema);