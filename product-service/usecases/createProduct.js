const { update } = require('../controllers/productController');
const productRepository = require('../repositories/productRepository');

module.exports = async (id, name, price, description, image, category, origin) => {
    try {
        if (!id || !name || !price || !image) {
            throw new Error('Missing required fields: id, name, or price');
        }

        // Check if the product already exists
        const existingProduct = await productRepository.findById(id);
        if (existingProduct) {
            throw new Error('Product with this ID already exists');
        }

        // Validate price
        if (typeof price !== 'number' || price <= 0) {
            throw new Error('Price must be a positive number');
        }

        const data = {
            id,
            name,
            price,
            origin: origin || 'Việt Nam', // Default origin if not provided
            description: description || '', // Default description to empty string if not provided
            image,
            category: category || 'other', // Default category if not provided
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        await productRepository.create(data);
        return { message: 'Product created successfully' };
    } catch (err) {
        console.error(err);
        throw new Error('Failed to retrieve products');
    }
}