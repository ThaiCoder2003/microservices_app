const productRepository = require('../repositories/productRepository');

module.exports = async (query) => {
    try {
        const products = await productRepository.search(query);
        if (!products || products.length === 0) {
            return []; // Return an empty array if no products found
        }
        return products.map(product => ({
            id: product.id,
            name: product.name,
            price: product.price,
            category: product.category,
            createdAt: product.createdAt,
            image: product.image,
        }));
    } catch (err) {
        console.error(err);
        throw new Error('Failed to search products');
    }
}