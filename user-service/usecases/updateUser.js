const userRepository = require('../repositories/userRepository');
const checkUser = require('../utils/checkUser')
module.exports = async ({ userId, email, name, profilePicture, address, phone }) => {
    try {
        const data = {};
        if (!userId || !email) {
            throw new Error('User ID and Email are required');
        }

        if (!name && !profilePicture && !address && !phone) {
            throw new Error('At least one field must be provided for update');
        }

        const user = await checkUser(userId);

        if (name) {
            data.name = name;
        }        
        
        if (profilePicture) {
            data.profilePicture = profilePicture;
        }

        if (address) {
            data.address = address;
        }

        if (phone) {
            data.phone = phone;
        }

        data.updatedAt = Date.now();

        await userRepository.update(userId, data);

        return {
            id: user._id,
            name: user.name,
            email: user.email,
            profilePicture: user.profilePicture,
            address: user.address,
            phone: user.phone,
            updatedAt: Date.now(),
        };
    } catch (err) {
        console.error(err);
        throw new Error('Failed to update user');
    }
}