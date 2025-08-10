const kafka  = require('../../../kafka-wrapper/index')
const Status = require('../models/status.model');
const { v4: uuidv4 } = require('uuid');
const producer = kafka.producer();

async function startProducer() {
    await producer.connect();
}

async function sendProductEvent(eventId, action, payload) {
  // Save status to MongoDB
    await Status.create({
        eventId,
        action,
        status: 'pending',
        payload,
    });

    try {
        await producer.send({
            topic: `product.${action}`,
            messages: [{ value: JSON.stringify({ eventId, data: payload}) }],
        });
    } catch (error) {
        console.error("Kafka send failed:", error);
        await Status.findOneAndUpdate({ eventId: eventId }, { status: 'failed', error: error.message });
        throw error; // So caller knows it failed
    }
}

module.exports = {
    producer,
    startProducer,
    sendProductEvent
}