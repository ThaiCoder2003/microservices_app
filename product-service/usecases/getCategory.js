const productRepository = require('../repositories/productRepository');

module.exports = async (category) => {
    try {
        const products = await productRepository.getByCategory(category);
        if (!products || products.length === 0) {
            return []; // Return an empty array if no products found
        }

        return products.map(product => ({
            id: product.id,
            name: product.name,
            price: product.price,
            createdAt: product.createdAt,
            category: product.category,
            image: product.image,
        }));
    } catch (err) {
        console.error(err);
        throw new Error('Failed to retrieve products by category');
    }
}