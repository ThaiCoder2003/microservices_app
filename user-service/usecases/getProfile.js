const userRepository = require('../repositories/userRepository');

function formatDate(dateObj) {
  const date = new Date(dateObj);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

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
            updatedAt: formatDate(user.updatedAt),
        };
    } catch (err) {
        console.error(err);
        throw new Error('Failed to retrieve profile');
    }
};