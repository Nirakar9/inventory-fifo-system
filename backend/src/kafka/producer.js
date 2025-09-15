const kafka = require("./config");

const producer = kafka.producer();

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const connectProducer = async (retries = 5, delayMs = 5000) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await producer.connect();
      console.log("✅ Kafka Producer connected");
      break; // Exit retry loop on success
    } catch (err) {
      console.error(`❌ Kafka producer connection error (attempt ${attempt}):`, err);
      if (attempt < retries) {
        console.log(`Retrying to connect producer in ${delayMs}ms...`);
        await delay(delayMs);
      } else {
        console.error('❌ Failed to connect Kafka producer after maximum retries');
      }
    }
  }
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
