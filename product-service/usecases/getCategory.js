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
            stock: product.stock,
            createdAt: product.createdAt,
            category: product.category,
            description: product.description
        }));
    } catch (err) {
        console.error(err);
        throw new Error('Failed to retrieve products by category');
    }
}