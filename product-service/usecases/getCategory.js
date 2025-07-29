const productRepository = require('../repositories/productRepository');

module.exports = async (category) => {
    try {
        const products = await productRepository.getByCategory(category);
        if (!products || products.length === 0) {
            throw new Error('No products found in this category');
        }
        return products.map(product => ({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            createdAt: product.createdAt,
        }));
    } catch (err) {
        console.error(err);
        throw new Error('Failed to retrieve products by category');
    }
}