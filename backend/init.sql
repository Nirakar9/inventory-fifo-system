DROP TABLE IF EXISTS sale_allocations;
DROP TABLE IF EXISTS sales;
DROP TABLE IF EXISTS inventory_batches;
DROP TABLE IF EXISTS products;

CREATE TABLE products (
  product_id TEXT PRIMARY KEY,
  name TEXT
);

CREATE TABLE inventory_batches (
  id SERIAL PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES products(product_id),
  quantity INT NOT NULL,
  unit_price NUMERIC(12,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE sales (
  id SERIAL PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES products(product_id),
  quantity INT NOT NULL,
  total_cost NUMERIC(14,2) NOT NULL,
  sold_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE sale_allocations (
  id SERIAL PRIMARY KEY,
  sale_id INT NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
  batch_id INT NOT NULL REFERENCES inventory_batches(id),
  quantity INT NOT NULL,
  unit_price NUMERIC(12,2) NOT NULL,
  cost NUMERIC(14,2) NOT NULL
);

INSERT INTO products(product_id, name)
  VALUES ('PRD001','Sample Product 1');

INSERT INTO products(product_id, name)
  VALUES ('PRD002','Sample Product 2');
