// const kafka = require('../../kafka-wrapper'); // Trước đó
const { consumer } = require('../../kafka-wrapper'); // Sửa lại: chỉ lấy đối tượng consumer

const Status = require('../models/status.model');
const userRepository = require('../../repositories/userRepository');
// const consumer = kafka.consumer({ groupId: 'user-service-group' }); // Xóa dòng này đi

async function startKafkaConsumer() {
    await consumer.connect();

    // Subscribe to both events
    await consumer.subscribe({ topic: 'user.registered', fromBeginning: false });
    await consumer.subscribe({ topic: 'user.updated', fromBeginning: false });
    await consumer.subscribe({ topic: 'user.deleted', fromBeginning: false });

    await consumer.run({
        eachMessage: async ({ topic, message }) => {
            const { eventId, data } = JSON.parse(message.value.toString());
            try {
                switch (topic){
                    case 'user.registered': 
                        try {
                            const user = await userRepository.create(data);
                            console.log(`[Kafka] User registered and saved: ${user._id}`)
                        } catch (err) {
                            console.error('[Kafka] Error saving user:', err.message);
                        }
                        break;
    
                    case 'user.updated':
                        try {
                            const updatedUser = await userRepository.updateById(data.userId, data.updateData);
                            console.log(`[Kafka] User updated: ${updatedUser._id}`)
                        } catch (err) {
                            console.error('[Kafka] Error updating user:', err.message);
                        }
                        break;
    
                    case 'user.deleted':
                        try {
                            await userRepository.deleteById(data.userId);
                            console.log(`[Kafka] User deleted successfully!`)
                        } catch (err) {
                            console.error('[Kafka] Error deleting user:', err.message);
                        }
                        break;
                }
    
                await Status.findOneAndUpdate(
                    { eventId },
                    { status: 'completed', updatedAt: new Date() }
                );
    
                console.log(`[Kafka] Successfully processed event ${eventId} (${topic})`);
            } catch (error) {
                console.error(`[Kafka] Failed to process event ${eventId}:`, err.message);

                await Status.findOneAndUpdate(
                    { eventId },
                    { status: 'failed', error: err.message, updatedAt: new Date() }
                );
            }
        }
    })
}

module.exports = startKafkaConsumer
