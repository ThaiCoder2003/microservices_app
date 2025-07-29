const checkUser = require('../utils/checkUser')

module.exports = async (userId) => {
    try {
        if (!userId) {
            return false
        }

        const user = await checkUser(userId);

        return true;
    } catch {
        return false
    }
};