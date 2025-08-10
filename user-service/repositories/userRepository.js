const User = require('../infrastructure/models/User');

module.exports = {
    findByEmail: (email) => User.findOne({ email: email }),
    findById: (id) => User.findById(id).select('-password'),
    findAll: () => User.find().select('-password'),
    create: (data) => new User(data).save(),
    updateById: (id, updateData) => User.findByIdAndUpdate(id, updateData, { new: true }).select('-password'),
    deleteById: (id) => User.findByIdAndDelete({ id })
};