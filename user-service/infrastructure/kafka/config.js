const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'user-service',
    brokers: ['localhost:9092'],
})

const producer = kafka.producer();

const produceUserCreatedEvent = async (user) => {
    await producer.connect();

    await producer.send({
        topic: 'user-events',
        messages: [
            {
                value: JSON.stringify({
                    eventName: 'UserRegistered',
                    payload: {
                        userId: user._id,
                        name: user.name,
                        email: user.email,
                    },
                }),
            }
        ]
    })
}