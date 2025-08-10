const productRepository = require('../repositories/productRepository'); 
const { sendProductEvent } = require('../infrastructure/kafka/product.producer')
const { v4: uuidv4 } = require('uuid');
module.exports = async (id) => {
    try {
        const deletedProduct = await productRepository.findById(id);
        if (!deletedProduct) {
            throw new Error('Product not found');
        }
        
        const eventId = uuidv4();
        await sendProductEvent(eventId, 'deleted', {
            id
        })
        return { 
            status: 202,
            message: 'Delete request sent!',
            eventId
        };
    } catch (err) {
        console.error(err);
        throw new Error('Failed to delete product');
    }
}