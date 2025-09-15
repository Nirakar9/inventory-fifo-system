require("dotenv").config();
const kafka = require("./config");

const producer = kafka.producer();
const topic = "inventory-events";

async function run() {
  await producer.connect();

  // Example: purchase 10 qty @ 50 for PRD001
  const event = {
    product_id: "PRD001",
    type: "purchase", // ya "sale"
    quantity: 10,
    unit_price: 50,
    timestamp: new Date().toISOString(),
  };

  await producer.send({
    topic,
    messages: [{ value: JSON.stringify(event) }],
  });

  console.log("📤 Sent:", event);
  await producer.disconnect();
}

run().catch((err) => {
  console.error("❌ Error sending:", err);
  process.exit(1);
});
