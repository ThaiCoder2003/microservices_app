const userRepository = require('../repositories/userRepository');
module.exports = async () => {
    try {
        const users = await userRepository.findAll(); // Exclude password field
        return users.map(user => ({
            id: user._id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }));
    } catch (err) {
        console.error(err);
        throw new Error('Failed to retrieve users');
    }
}