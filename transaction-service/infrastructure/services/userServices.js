const axios = require('axios');

const USER_SERVICE = 'http://localhost:5001';

module.exports = {
    async getUserById(token) {
        try {
            const response = await axios.get(`${USER_SERVICE}/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            return response.data;
        } catch (error) {
            console.error(`Error fetching user with token ${token}:`, error);
            throw new Error('Failed to fetch user');
        }
    }
}