const productRepository = require('../repositories/productRepository');

module.exports = async (id, name, price, image, description, origin, category ) => {
    try {
        if (!id || !name || !price) {
            throw new Error('Missing required fields: id, name, or price');
        }

        const data = {
            id,
            name,
            price,
            image, // Default image
            createdAt: new Date(),
            description,
            origin,
            category
        };
        await productRepository.create(data);
        return { message: 'Product created successfully' };
    } catch (err) {
        console.error(err);
        throw new Error('Failed to retrieve products');
    }
}