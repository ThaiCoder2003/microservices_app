// const kafka = require('../../kafka-wrapper'); // Trước đó
const { producer } = require('../../kafka-wrapper'); // Sửa lại: chỉ lấy đối tượng producer

const Status = require('../models/status.model');
// const producer = kafka.producer(); // Xóa dòng này đi

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
