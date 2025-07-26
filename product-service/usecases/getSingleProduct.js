const productRepository = require('../repositories/productRepository');

module.exports = async (id) => {
    try {
        const product = await productRepository.findById(id);
        if (!product) {
            throw new Error('Product not found');
        }
        return {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            description: product.description,
            origin: product.origin,
            createdAt: product.createdAt
        };
    } catch (err) {
        console.error(err);
        throw new Error('Failed to retrieve product');
    }
}