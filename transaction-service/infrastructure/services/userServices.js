const axios = require('axios');

const USER_SERVICE = process.env.USER_SERVICE_URL;

module.exports = {
    async getUserById(userId) {
        try {
            const response = await axios.get(`${USER_SERVICE}/verify/${userId}`);

            return response.data && response.data.verified ? { id: response.data.userId } : null;
        } catch (error) {
            console.error(`Error fetching user with user ${userId}:`, error);
            throw new Error('Failed to fetch user');
        }
    }
}