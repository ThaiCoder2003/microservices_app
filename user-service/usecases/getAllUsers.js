const userRepository = require('../repositories/userRepository');

function formatDate(dateObj) {
  const date = new Date(dateObj);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

module.exports = async () => {
    try {
        const users = await userRepository.findAll(); // Exclude password field
        return users.map(user => ({
            id: user._id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: formatDate(user.updatedAt),
        }));
    } catch (err) {
        console.error(err);
        throw new Error('Failed to retrieve users');
    }
}