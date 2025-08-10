const bcrypt = require('bcrypt');
const userRepository = require('../repositories/userRepository');
const { sendUserEvent } = require('../infrastructure/kafka/user.producer');
const { v4: uuidv4 } = require('uuid');

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
        
        const eventId = uuidv4();
        await sendUserEvent(eventId, 'registered', data);
        return {
            status: 202,
            message: 'Request has been sent!',
            eventId
        };
    } catch (err) {
        console.error(err);
        throw new Error('Could not process registration event');
    }
}