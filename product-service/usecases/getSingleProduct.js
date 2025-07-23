const productRepository = require('../repositories/productRepository');

module.exports = async (id) => {
    try {
        const product = await productRepository.findById(id);
        if (!product) {
            return null; // Return null if product not found
        }
        return {
            id: product.id,
            name: product.name,
            price: product.price,
            origin: product.origin,
            description: product.description,
            image: product.image,
            category: product.category,
            updatedAt: product.updatedAt,
        };
    } catch (err) {
        console.error(err);
        throw new Error('Failed to retrieve product');
    }
}