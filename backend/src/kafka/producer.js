const kafka = require("./config");

const producer = kafka.producer();

const connectProducer = async () => {
  await producer.connect();
  console.log("✅ Kafka Producer connected");
};

const sendMessage = async (topic, message) => {
  try {
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
    console.log("📤 Message sent:", message);
  } catch (err) {
    console.error("❌ Error sending message:", err);
  }
};

module.exports = { connectProducer, sendMessage, producer };
