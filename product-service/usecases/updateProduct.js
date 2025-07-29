const productRepository = require('../repositories/productRepository');

module.exports = async (id, updateData) => {
    try {
        const updatedProduct = await productRepository.updateById(id, updateData);
        if (!updatedProduct) {
            throw new Error('Product not found');
        }
        return {
            id: updatedProduct.id,
            name: updatedProduct.name,
            price: updatedProduct.price,
            image: updatedProduct.image,
            origin: updatedProduct.origin,
            description: updatedProduct.description,
            createdAt: updatedProduct.createdAt,
        };
    } catch (err) {
        console.error(err);
        throw new Error('Failed to update product');
    }
}