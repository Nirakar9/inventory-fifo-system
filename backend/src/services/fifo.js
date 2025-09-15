const db = require('../db');

async function processPurchase({ product_id, quantity, unit_price, timestamp }) {
  await db.query(
    `INSERT INTO products(product_id, name) VALUES ($1, $2) ON CONFLICT (product_id) DO NOTHING`,
    [product_id, product_id]
  );

  const createdAt = timestamp ? new Date(timestamp) : new Date();

  const res = await db.query(
    `INSERT INTO inventory_batches(product_id, quantity, unit_price, created_at)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [product_id, quantity, unit_price, createdAt]
  );

  return res.rows[0];
}

async function processSale({ product_id, quantity, timestamp }) {
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');

    const avail = await client.query(
      `SELECT COALESCE(SUM(quantity),0) AS total FROM inventory_batches WHERE product_id=$1`,
      [product_id]
    );

    const totalAvailable = parseInt(avail.rows[0].total, 10);
    if (totalAvailable < quantity) {
      throw new Error(`Insufficient stock. Available ${totalAvailable}, requested ${quantity}`);
    }

    const soldAt = timestamp ? new Date(timestamp) : new Date();
    const saleRes = await client.query(
      `INSERT INTO sales(product_id, quantity, total_cost, sold_at)
       VALUES ($1, $2, 0, $3) RETURNING id`,
      [product_id, quantity, soldAt]
    );

    const saleId = saleRes.rows[0].id;
    const batchesRes = await client.query(
      `SELECT id, quantity, unit_price FROM inventory_batches
       WHERE product_id=$1 AND quantity>0
       ORDER BY created_at ASC FOR UPDATE`,
      [product_id]
    );

    let remaining = quantity;
    let totalCost = 0;

    for (const batch of batchesRes.rows) {
      if (remaining <= 0) break;
      const take = Math.min(remaining, batch.quantity);
      const cost = take * parseFloat(batch.unit_price);

      await client.query(
        `INSERT INTO sale_allocations(sale_id, batch_id, quantity, unit_price, cost)
         VALUES($1,$2,$3,$4,$5)`,
        [saleId, batch.id, take, batch.unit_price, cost]
      );

      await client.query(
        `UPDATE inventory_batches SET quantity = quantity - $1 WHERE id=$2`,
        [take, batch.id]
      );

      totalCost += cost;
      remaining -= take;
    }

    await client.query(`UPDATE sales SET total_cost=$1 WHERE id=$2`, [totalCost, saleId]);
    await client.query('COMMIT');

    return { saleId, totalCost };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

module.exports = { processPurchase, processSale };
