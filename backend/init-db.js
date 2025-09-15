require('dotenv').config();
const fs = require('fs');
const db = require('./src/db');

async function initDB() {
  try {
    console.log('Connecting to database...');
    await db.query('SELECT 1');
    console.log('Connected. Running init.sql...');
    const sql = fs.readFileSync('./init.sql', 'utf8');
    console.log('SQL content length:', sql.length);
    await db.query(sql);
    console.log('Database initialized successfully');
  } catch (err) {
    console.error('Error initializing database:', err);
  } finally {
    process.exit();
  }
}

initDB();
