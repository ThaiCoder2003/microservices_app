const receiptRepository = require('../../domain/repositories/receiptRepository');
const cartRepository = require('../../domain/repositories/cartRepository')

const receiptEvents = require('../../domain/events/receiptEvents')
const getCart = require('../cart/getCart');

const productService = require('../../infrastructure/services/productServices');
const { ReceiptEventTypes, createReceiptEvent } = receiptEvents;

module.exports = async function CreateReceipt(userId) {
    try {
        // Create a new receipt event
        const events = await cartRepository.getEventsByUser(userId);
        if (!events || events.length === 0){
            throw new Error('No items in cart to purchase');
        }

        const cart = await getCart(userId);
        if (cart.items.length == 0){
            throw new Error('No items in cart to purchase');
        }

        const items = cart.items;
        const receiptEvent = createReceiptEvent(ReceiptEventTypes.PURCHASE_COMPLETED, userId, { items, totalPrice: cart.totalPrice }, Date.now());

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