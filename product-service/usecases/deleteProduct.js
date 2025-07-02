const productRepository = require('../repositories/productRepository'); 

module.exports = async (id) => {
    try {
        const deletedProduct = await productRepository.deleteById(id);
        if (!deletedProduct) {
            throw new Error('Product not found');
        }
        return true; // Return true to indicate successful deletion
    } catch (err) {
        console.error(err);
        throw new Error('Failed to delete product');
    }
}