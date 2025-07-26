const userRepository = require('../repositories/userRepository');

async function ensureUserExists(userId) {
  const user = await userRepository.findById(userId);
  if (!user) throw new Error('User not found');
  return user;
}

module.exports = ensureUserExists;