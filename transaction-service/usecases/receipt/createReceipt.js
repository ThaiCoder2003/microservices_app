const receiptRepository = require('../../domain/repositories/receiptRepository');

const receiptEvents = require('../../domain/events/receiptEvents')
const checkCart = require('../../utils/checkCart')

const { ReceiptEventTypes, createReceiptEvent } = receiptEvents;

module.exports = async function CreateReceipt(userId) {
    try {
        // Create a new receipt event
        const cart = await checkCart(userId);
        const items = cart.items;
        const receiptEvent = createReceiptEvent(
            ReceiptEventTypes.PURCHASE_COMPLETED, 
            userId, 
            { items, totalPrice: cart.totalPrice }, 
            Date.now()
        );

        // Save the event to the database
        const savedReceipt = await receiptRepository.createEvent(receiptEvent);
        
        return {
            message: 'Purchase Successful',
            id: savedReceipt._id,
            userId: userId,
            type: savedReceipt.type,
            payload: savedReceipt.payload,
            timestamp: savedReceipt.timestamp
        };
    } catch (err) {
        console.error(err);
        throw new Error('Failed to create receipt');
    }
}