const userRepository = require('../repositories/userRepository');
const checkUser = require('../utils/checkUser')

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

        const user = await checkUser(userId);

        return {
            id: user._id,
            name: user.name,
            email: user.email,
            profilePicture: user.profilePicture,
            birthday: formatDate(user.birthday),
            address: user.address,
            phone: user.phone
        };
    } catch (err) {
        console.error(err);
        throw new Error('Failed to retrieve profile');
    }
};