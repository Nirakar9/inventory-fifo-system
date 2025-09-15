require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const { connectConsumer } = require('./kafka/consumer');
const { connectProducer } = require('./kafka/producer');
const db = require('./db');

const PORT = process.env.PORT || 4000;
const app = express();


app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(routes);

app.get('/', (req, res) => res.send('Inventory FIFO Backend running'));

async function start() {
  try {
    await db.query('SELECT 1');
    console.log('✅ Connected to Postgres');
  } catch (err) {
    console.error('❌ Postgres not ready:', err.message);
  }

  try {
    await connectProducer();
  } catch (err) {
    console.error('❌ Kafka producer failed:', err);
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server listening on port ${PORT}`);
  });

  connectConsumer("inventory-events").catch(err => console.error('Kafka consumer failed:', err));
}

start();
