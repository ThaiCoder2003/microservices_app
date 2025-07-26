const bcrypt = require('bcrypt');
const userRepository = require('../repositories/userRepository');

module.exports = async ({ email, password }) => {
    try {
        if (!email || !password) {
            throw new Error('Email and password are required');
        }

        const user = await userRepository.findByEmail(email);
        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            throw new Error('Invalid credentials');
        }
        return {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        };
    } catch (err) {
        console.error(err);
        throw new Error('Login failed');
    }
};
