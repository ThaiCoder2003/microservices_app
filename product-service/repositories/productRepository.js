const Product = require('../models/Products');

module.exports = {
    findById: (id) => Product.find({id: id}),
    findAll: () => Product.find(),
    create: (data) => new Product(data).save(),
    updateById: (id, updateData) => Product.findOneAndUpdate({id: id}, updateData, { new: true }),
    deleteById: (id) => Product.findOneAndDelete({id: id}),
    search: (query) => Product.find({ name: new RegExp(query, 'i') }),
}