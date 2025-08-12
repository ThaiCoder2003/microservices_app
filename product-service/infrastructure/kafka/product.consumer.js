const kafka = require('../../kafka-wrapper')
const productRepository = require('../../repositories/productRepository');
const Status = require('../models/status.model');
const consumer = kafka.consumer({ groupId: 'user-service-group' });

async function startKafkaConsumer() {
  await consumer.connect();

// Subscribe to both events
  await consumer.subscribe({ topic: 'product.created', fromBeginning: false });
  await consumer.subscribe({ topic: 'product.updated', fromBeginning: false });
  await consumer.subscribe({ topic: 'product.deleted', fromBeginning: false });
  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      try {
      const { eventId, data } = JSON.parse(message.value.toString());
        switch (topic){
          case 'product.created': 
            try {
                const product = await productRepository.create(data);
                console.log(`[Kafka] New Product Created: ${product.id}`)
            } catch (err) {
                console.error('[Kafka] Error saving user:', err.message);
            }
            break;
  
          case 'product.updated':
            try {
              const { id, updateData } = data;
              const updatedProduct = await productRepository.updateById(id, updateData);
              console.log(`[Kafka] Product updated: ${updatedProduct.id}`)
            } catch (err) {
                console.error('[Kafka] Error updating product:', err.message);
            }
            break;
  
          case 'product.deleted':
            try {
              const { id } = data;
              await productRepository.deleteById(id);
              console.log(`[Kafka] User deleted successfully!`)
            } catch (err) {
                console.error('[Kafka] Error deleting Product:', err.message);
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

module.exports = startKafkaConsumer;