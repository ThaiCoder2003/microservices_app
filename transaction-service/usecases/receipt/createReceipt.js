const receiptRepository = require('../../domain/repositories/receiptRepository');
const cartRepository = require('../../domain/repositories/cartRepository');
const receiptEvents = require('../../domain/events/receiptEvents')
const { ReceiptEventTypes, createReceiptEvent } = receiptEvents;

module.exports = async function CreateReceipt(userId, items) {
    try {
        const cartEvents = await cartRepository.getEventsByUser(userId);
        if (cartEvents.length === 0) {
            throw new Error('No items in cart to purchase');
        }
        // Create a new receipt event
        const receiptEvent = createReceiptEvent(ReceiptEventTypes.PURCHASE_COMPLETED, userId, { items });

        // Save the event to the database
        const savedReceipt = await receiptRepository.createEvent(receiptEvent);
        
        return {
            id: savedReceipt._id,
            userId: savedReceipt.userId,
            type: savedReceipt.type,
            payload: savedReceipt.payload,
            timestamp: savedReceipt.timestamp
        };
    } catch (err) {
        console.error(err);
        throw new Error('Failed to create receipt');
    }
}