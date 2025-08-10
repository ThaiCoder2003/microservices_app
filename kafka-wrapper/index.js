const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'coffe-am',            // Change to match your app or service
  brokers: ['localhost:9092'],        // Or ['kafka:9092'] in Docker
});

module.exports = kafka;