const kafka = require("./config");

const connectConsumer = async (topic) => {
  const consumer = kafka.consumer({ groupId: "inventory-group" });
  try {
    await consumer.connect();
    await consumer.subscribe({ topic, fromBeginning: true });
    console.log(`✅ Kafka consumer connected to topic: ${topic}`);

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const event = JSON.parse(message.value.toString());
        console.log(`📥 Received event:`, event);

        const db = require('../db');

        try {
          if (event.type === 'purchase') {
            // Insert inventory batch
            await db.query(
              `INSERT INTO inventory_batches (product_id, quantity, unit_price, created_at)
               VALUES ($1, $2, $3, NOW())`,
              [event.product_id, event.quantity, event.unit_price]
            );
            console.log('✅ Inventory batch inserted');
          } else if (event.type === 'sale') {
            // Insert sale and allocations in a transaction with FIFO allocation
            await db.pool.query('BEGIN');
            const saleResult = await db.query(
              `INSERT INTO sales (product_id, quantity, total_cost, sold_at)
               VALUES ($1, $2, $3, NOW()) RETURNING id`,
              [event.product_id, event.quantity, event.total_cost]
            );
            const saleId = saleResult.rows[0].id;

            // Fetch inventory batches for product ordered by created_at (FIFO)
            const batchesResult = await db.query(
              `SELECT id, quantity, unit_price FROM inventory_batches
               WHERE product_id = $1 AND quantity > 0
               ORDER BY created_at ASC`,
              [event.product_id]
            );
            let remainingQty = event.quantity;

            for (const batch of batchesResult.rows) {
              if (remainingQty <= 0) break;
              const allocQty = Math.min(batch.quantity, remainingQty);
              const allocCost = allocQty * parseFloat(batch.unit_price);

              // Insert allocation
              await db.query(
                `INSERT INTO sale_allocations (sale_id, batch_id, quantity, unit_price, cost)
                 VALUES ($1, $2, $3, $4, $5)`,
                [saleId, batch.id, allocQty, batch.unit_price, allocCost]
              );

              // Update batch quantity
              await db.query(
                `UPDATE inventory_batches SET quantity = quantity - $1 WHERE id = $2`,
                [allocQty, batch.id]
              );

              remainingQty -= allocQty;
            }

            if (remainingQty > 0) {
              throw new Error('Not enough inventory batches to allocate sale');
            }

            await db.pool.query('COMMIT');
            console.log('✅ Sale and allocations inserted with FIFO allocation');
          } else {
            console.warn('⚠️ Unknown event type:', event.type);
          }
        } catch (err) {
          await db.pool.query('ROLLBACK');
          console.error('❌ Error processing event:', err);
        }
      },
    });
  } catch (err) {
    console.error("❌ Error in consumer:", err);
  }
};

module.exports = { connectConsumer };
