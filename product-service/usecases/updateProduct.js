const { sendProductEvent } = require('../infrastructure/kafka/product.producer')
const productRepository = require('../repositories/productRepository'); 
const { v4: uuidv4 } = require('uuid');
module.exports = async (id, updateData) => {
    try {
        const existingProduct = await productRepository.findById(id);
        if (!existingProduct) {
            throw new Error('Product not found');
        }

        const eventId = uuidv4();
        await sendProductEvent(eventId, 'updated', {
            id,
            updateData,
        })
        return { 
            status: 202,
            message: 'Update request sent!',
            eventId
        };
    } catch (err) {
        console.error(err);
        throw new Error('Failed to update product');
    }
}