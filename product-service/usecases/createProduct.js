const productRepository = require('../repositories/productRepository');

module.exports = async (id, name, price, stock ) => {
    try {
        if (!id || !name || !price) {
            throw new Error('Missing required fields: id, name, or price');
        }

        const data = {
            id,
            name,
            price,
            stock: stock || 0, // Default stock to 0 if not provided
            createdAt: new Date(),
        };
        await productRepository.create(data);
        return { message: 'Product created successfully' };
    } catch (err) {
        console.error(err);
        throw new Error('Failed to retrieve products');
    }
}