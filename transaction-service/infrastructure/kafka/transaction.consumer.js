// const kafka = require('../../kafka-wrapper'); // Trước đó
const { consumer } = require('../../kafka-wrapper'); // Sửa lại: chỉ lấy đối tượng consumer

const cartRepository = require('../../domain/repositories/cartRepository');
const receiptRepository = require('../../domain/repositories/receiptRepository');
const Status = require('../models/status.model');

// const consumer = kafka.consumer({ groupId: 'user-service-group' }); // Xóa dòng này đi

async function handleCartEvent(cartEvent, successMsg) {
    try {
        await cartRepository.createEvent(cartEvent);
        console.log(`[Kafka] ${successMsg}`); 
    }   catch (err) {
        console.error('[Kafka] Error adding product to cart:', err.message);
    }
}

async function startKafkaConsumer() {
    await consumer.connect();

    const topics = [
        'transaction.cart.added',
        'transaction.cart.deleted',
        'transaction.cart.cleared',
        'transaction.checkout'
    ];
    for (const topic of topics) {
        await consumer.subscribe({ topic, fromBeginning: false });
    }
    await consumer.run({
        eachMessage: async ({ topic, message }) => {
            try {
                const { eventId, data } = JSON.parse(message.value.toString());
                if (!eventId) {
                    console.error(`[Kafka] No event Id!`);
                    return;
                }
                switch (topic){
                    case 'transaction.cart.added': 
                        await handleCartEvent(data.cartEvent, 'Product Added to Cart!')
                        break;
                    case 'transaction.cart.deleted': 
                        await handleCartEvent(data.cartEvent, 'Product Removed from Cart!')
                        break;
                    case 'transaction.cart.cleared': 
                        await handleCartEvent(data.cartEvent, 'Cart cleared!')
                        break;
                    case 'transaction.checkout':
                        try{
                            await receiptRepository.createEvent(data.receiptEvent);
                            await cartRepository.createEvent(data.cartEvent);
                            console.log(`[Kafka] Checkout successful!`);
                        }   catch (err) {
                            console.error('[Kafka] Error adding product to cart:', err.message);
                        }
                }

                await Status.findOneAndUpdate(
                    { eventId },
                    { status: 'completed' }
                );
            
                console.log(`[Kafka] Successfully processed event ${eventId} (${topic})`);
            } catch (error) {
                console.error(`[Kafka] Failed to process event ${eventId}:`, error.message);
        
                await Status.findOneAndUpdate(
                    { eventId },
                    { status: 'failed', error: error.message }
                );
            }
        } 
    })
}

module.exports = startKafkaConsumer;
