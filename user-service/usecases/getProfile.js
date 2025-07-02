const userRepository = require('../repositories/userRepository');

module.exports = async (userId) => {
    try {
        if (!userId) {
            throw new Error('User ID is required');
        }

        const user = await userRepository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        return {
            id: user._id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    } catch (err) {
        console.error(err);
        throw new Error('Failed to retrieve profile');
    }
};