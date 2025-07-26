const userRepository = require('../repositories/userRepository');
const checkUser = require('../utils/checkUser')

module.exports = async ({ id }) => {
    try {
        if (!id) {
            throw new Error('No id to delete!');
        }

        const user = await checkUser(id);

        await userRepository.deleteById(user._id);
        return {
            message: 'Delete complete!'
        };
    } catch (err) {
        console.error(err);
        throw new Error('Login failed');
    }
};
