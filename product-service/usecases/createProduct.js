const { sendProductEvent } = require('../infrastructure/kafka/product.producer')
const { v4: uuidv4 } = require('uuid');
module.exports = async (data) => {
    try {
        const eventId = uuidv4();
        await sendProductEvent(eventId, 'created', {
            product: data 
        });
        return { 
            status: 202,
            message: 'Adding request sent!',
            eventId
        };
    } catch (err) {
        console.error(err);
        throw new Error('Failed to create products');
    }
}