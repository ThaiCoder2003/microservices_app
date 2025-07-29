const productRepository = require('../repositories/productRepository');

module.exports = async () => {
    try {
        const products = await productRepository.findAll();
        return products.map(product => ({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            createdAt: product.createdAt,
        }));
    } catch (err) {
        console.error(err);
        throw new Error('Failed to retrieve products');
    }
}