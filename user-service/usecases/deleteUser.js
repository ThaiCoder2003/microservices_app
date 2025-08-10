const checkUser = require('../utils/checkUser')
const { sendUserEvent } = require('../infrastructure/kafka/user.producer');
const { v4: uuidv4 } = require('uuid');

module.exports = async ({ id }) => {
    try {
        if (!id) {
            throw new Error('No id to delete!');
        }

        const user = await checkUser(id);

        const eventId = uuidv4();
        await sendUserEvent(eventId, 'deleted', { userId: user._id })
        return {
            status: 202,
            message: 'Request has been sent!',
            eventId
        };
    } catch (err) {
        console.error(err);
        throw new Error('Delete process failed!');
    }
};
