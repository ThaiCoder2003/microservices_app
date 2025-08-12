const { Kafka } = require('kafkajs');

// Lấy địa chỉ Kafka từ biến môi trường, mặc định là 'localhost:9092' nếu không có
const BROKERS = process.env.KAFKA_BROKER ? [process.env.KAFKA_BROKER] : ['localhost:9092'];

const kafka = new Kafka({
  clientId: 'coffe-am',
  brokers: BROKERS
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'my-group' });

const init = async () => {
  await producer.connect();
  await consumer.connect();
};

module.exports = {
  producer,
  consumer,
  init
};
