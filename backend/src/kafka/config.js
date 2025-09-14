// backend/src/kafka/config.js
const { Kafka, logLevel } = require("kafkajs");


const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID || "inventory-service",
  brokers: [process.env.REDPANDA_BROKER],
  ssl: process.env.REDPANDA_SECURITY === "SASL_SSL",
  sasl: {
    mechanism: process.env.REDPANDA_MECHANISM || "SCRAM-SHA-512",
    username: process.env.REDPANDA_USERNAME,
    password: process.env.REDPANDA_PASSWORD,
  },
  logLevel: logLevel.DEBUG,
});

module.exports = kafka;
