const checkUser = require('../utils/checkUser')
const { sendUserEvent } = require('../infrastructure/kafka/user.producer');
const { v4: uuidv4 } = require('uuid');

module.exports = async ({ userId, email, name, profilePicture, address, phone }) => {
    try {
        const updateData = {};
        if (!userId || !email) {
            throw new Error('User ID and Email are required');
        }

        if (!name && !profilePicture && !address && !phone) {
            throw new Error('At least one field must be provided for update');
        }

        await checkUser(userId);

        if (name) updateData.name = name;
        
        if (profilePicture) updateData.profilePicture = profilePicture;

        if (address) updateData.address = address;

        if (phone) updateData.phone = phone;

        updateData.updatedAt = new Date();
        const eventId = uuidv4();
        await sendUserEvent(eventId, 'updated', {
            userId,
            updateData
        })

        return {
            status: 202,
            message: 'Request has been sent!',
            eventId
        };
    } catch (err) {
        console.error(err);
        throw new Error('Update process failed!')
    }
}