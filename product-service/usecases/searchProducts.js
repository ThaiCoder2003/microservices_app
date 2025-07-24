const productRepository = require('../repositories/productRepository');

module.exports = async (query) => {
    try {
        const products = await productRepository.search(query);
        return products.map(product => ({
            id: product.id,
            name: product.name,
            price: product.price,
            stock: product.stock,
            createdAt: product.createdAt,
        }));
    } catch (err) {
        console.error(err);
        throw new Error('Failed to search products');
    }
}