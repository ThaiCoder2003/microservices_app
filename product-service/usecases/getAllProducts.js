const productRepository = require('../repositories/productRepository');

module.exports = async () => {
    try {
        const products = await productRepository.findAll();
        
        if (!products || products.length === 0) {
            return []; // Return an empty array if no products found
        }

        return products.map(product => ({
            id: product.id,
            name: product.name,
            price: product.price,
            createdAt: product.createdAt,
            image: product.image,
            category: product.category
        }));
    } catch (err) {
        console.error(err);
        throw new Error('Failed to retrieve products');
    }
}