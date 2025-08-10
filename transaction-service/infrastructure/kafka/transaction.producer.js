const kafka  = require('../../../kafka-wrapper/index')
const Status = require('../models/status.model');
const { v4: uuidv4 } = require('uuid');
const producer = kafka.producer();

async function startProducer() {
    await producer.connect();
}

async function sendTransactionEvent(eventId, action, payload) {
  // Save status to MongoDB
    await Status.create({
        eventId,
        action,
        status: 'pending',
        payload,
    });

    try {
        await producer.send({
            topic: `transaction.${action}`,
            messages: [{ key: eventId, value: JSON.stringify({ eventId, data: payload}) }],
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
    sendTransactionEvent
}