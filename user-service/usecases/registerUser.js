const bcrypt = require('bcrypt');
const userRepository = require('../repositories/userRepository');

module.exports = async ({ name, email, password, confirmPassword }) => {
    try{
        if (!name || !email || !password || !confirmPassword) {
            throw new Error('All fields are required');
        }

        const existingUser = await userRepository.findByEmail(email);
        if (existingUser) {
            throw new Error('Email already exists');
        }

        if (password !== confirmPassword) {
            throw new Error('Passwords do not match');
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const data = {
            name,
            email,
            password: hashedPassword,
        };

        return userRepository.create(data);
    } catch (err) {
        console.error(err);
        throw new Error('Registration failed');
    }
}