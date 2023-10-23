// producer.ts
import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'my-producer',
  brokers: ['localhost:9092'],
});

const createTopic = async () => {
    const admin = kafka.admin()
    await admin.connect()
    await admin.createTopics({
      topics: [{
        topic: 'notification-topic',
        numPartitions: 1,
        replicationFactor: 1
      }],
    })
    await admin.disconnect()
}
  
createTopic().catch(console.error)

const produceMessage = async () => {
  const producer = kafka.producer();
  
  await producer.connect();
  await producer.send({
    topic: 'test-topic',
    messages: [
      { value: 'Hello Kafka!' },
    ],
  });
  
  await producer.disconnect();
};

produceMessage().catch(console.error);
