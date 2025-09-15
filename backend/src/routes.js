const express = require('express');
const auth = require('basic-auth');
const db = require('./db');
const { processPurchase, processSale } = require('./services/fifo');

const router = express.Router();

function requireAuth(req, res, next) {
  const user = auth(req);
  if (
    !user ||
    user.name !== process.env.BASIC_USER ||
    user.pass !== process.env.BASIC_PASS
  ) {
    res.set('WWW-Authenticate', 'Basic realm="401"');
    return res.status(401).send('Authentication required.');
  }
  next();
}

router.get('/api/products', requireAuth, async (req, res) => {
  const result = await db.query(`
    SELECT p.product_id, p.name
    FROM products p
  `);
  res.json(result.rows);
});

router.get('/api/ledger', requireAuth, async (req, res) => {
  const result = await db.query(`
    SELECT s.id, s.product_id, s.quantity, s.total_cost, s.sold_at,
           a.batch_id, a.quantity as batch_qty, a.unit_price, a.cost
    FROM sales s
    JOIN sale_allocations a ON s.id = a.sale_id
    ORDER BY s.sold_at DESC
  `);
  res.json(result.rows);
});





// New route to add product (purchase)
router.post('/api/products', requireAuth, async (req, res) => {
  const { product_id, quantity, unit_price, timestamp } = req.body;
  if (!product_id || !quantity || !unit_price) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const batch = await processPurchase({ product_id, quantity, unit_price, timestamp });
    res.status(201).json(batch);
  } catch (err) {
    console.error('Error adding product:', err);
    res.status(500).json({ error: 'Failed to add product' });
  }
});

// New route to sell product
router.post('/api/sell', requireAuth, async (req, res) => {
  const { product_id, quantity, timestamp } = req.body;
  if (!product_id || !quantity) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const sale = await processSale({ product_id, quantity, timestamp });
    res.status(201).json(sale);
  } catch (err) {
    console.error('Error processing sale:', err);
    res.status(500).json({ error: err.message || 'Failed to process sale' });
  }
});

// New route to delete product
router.delete('/api/products/:product_id', requireAuth, async (req, res) => {
  const { product_id } = req.params;
  if (!product_id) {
    return res.status(400).json({ error: 'Product ID is required' });
  }
  try {
    // Delete inventory batches first due to foreign key constraint
    await db.query('DELETE FROM inventory_batches WHERE product_id = $1', [product_id]);
    // Also delete sales and sale_allocations related to this product to avoid FK constraint issues
    await db.query('DELETE FROM sale_allocations WHERE sale_id IN (SELECT id FROM sales WHERE product_id = $1)', [product_id]);
    await db.query('DELETE FROM sales WHERE product_id = $1', [product_id]);
    // Then delete the product
    const result = await db.query('DELETE FROM products WHERE product_id = $1', [product_id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Error deleting product:', err);
    // Add detailed error logging
    if (err.code) {
      console.error(`Postgres error code: ${err.code}`);
    }
    if (err.detail) {
      console.error(`Postgres error detail: ${err.detail}`);
    }
    if (err.hint) {
      console.error(`Postgres error hint: ${err.hint}`);
    }
    res.status(500).json({ error: 'Failed to delete product', details: err.message });
  }
});

module.exports = router;
