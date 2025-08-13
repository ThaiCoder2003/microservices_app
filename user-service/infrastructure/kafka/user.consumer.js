// const kafka = require('../../kafka-wrapper'); // Trước đó
const { consumer } = require('../../kafka-wrapper'); // Sửa lại: chỉ lấy đối tượng consumer

const Status = require('../models/status.model');
const userRepository = require('../../repositories/userRepository');
// const consumer = kafka.consumer({ groupId: 'user-service-group' }); // Xóa dòng này đi

async function startKafkaConsumer() {
    await consumer.connect();

    await consumer.subscribe({ topic: 'user.registered', fromBeginning: false });
    await consumer.subscribe({ topic: 'user.updated', fromBeginning: false });
    await consumer.subscribe({ topic: 'user.deleted', fromBeginning: false });

    await consumer.run({
        eachMessage: async ({ topic, message }) => {
            const { eventId, data } = JSON.parse(message.value.toString());
            
            try {
                // The outer try block is all you need.
                switch (topic) {
                    case 'user.registered':
                        // No inner try/catch here. If this fails, the outer catch will handle it.
                        const user = await userRepository.create(data);
                        console.log(`[Kafka] User registered and saved: ${user._id}`);
                        break;

                    case 'user.updated':
                        const updatedUser = await userRepository.updateById(data.userId, data.updateData);
                        console.log(`[Kafka] User updated: ${updatedUser._id}`);
                        break;

                    case 'user.deleted':
                        await userRepository.deleteById(data.userId);
                        console.log(`[Kafka] User deleted successfully!`);
                        break;
                }

                // This code only runs if the switch case completes WITHOUT errors.
                await Status.findOneAndUpdate(
                    { eventId },
                    { status: 'completed', updatedAt: new Date() }
                );
                console.log(`[Kafka] Successfully processed event ${eventId} (${topic})`);

            } catch (error) {
                // This single catch block will now handle ALL errors (database, etc.).
                console.error(`[Kafka] Failed to process event ${eventId}:`, error.message);
                
                await Status.findOneAndUpdate(
                    { eventId },
                    { status: 'failed', error: error.message, updatedAt: new Date() }
                );
            }
        }
    });
}
module.exports = startKafkaConsumer
