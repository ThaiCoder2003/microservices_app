const receiptEvents = require('../../domain/events/receiptEvents')
const cartEvents = require('../../domain/events/cartEvents')
const checkCart = require('../../utils/checkCart')
const { v4: uuidv4 } = require('uuid');

const { ReceiptEventTypes, createReceiptEvent } = receiptEvents;
const { CartEventTypes, createCartEvent } = cartEvents;

module.exports = async function CreateReceipt(userId) {
    try {
        // Create a new receipt event
        const cart = await checkCart(userId);
        const items = cart.items;
        const receiptEvent = createReceiptEvent(
            ReceiptEventTypes.PURCHASE_COMPLETED, 
            userId, 
            { items, totalPrice: cart.totalPrice }, 
        );

        const cartEvent = createCartEvent(
            CartEventTypes.CART_CLEARED, 
            userId, 
            {}
        );
        
        const eventId = uuidv4();
        await sendTransactionEvent(eventId, 'checkout', {
            cartEvent,
            receiptEvent
        })
        return { 
            status: 202,
            message: 'Request sent!',
            eventId
        };

    } catch (err) {
        console.error(err);
        throw new Error('Failed to create receipt');
    }
}