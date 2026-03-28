import { pool } from "./index.js"; 

export const init = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS cart (
      id SERIAL PRIMARY KEY,
      session_id VARCHAR(255) NOT NULL,
      product_id INT REFERENCES products(id) ON DELETE CASCADE,
      quantity INT NOT NULL DEFAULT 1,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      price NUMERIC(10, 2) NOT NULL,
      image_url TEXT,
      category VARCHAR(100),
      stock INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  const { rows } = await pool.query("SELECT COUNT(*) FROM products");
  if (parseInt(rows[0].count) === 0) {
    await pool.query(`
      INSERT INTO products (name, description, price, image_url, category, stock) VALUES
      ('Wireless Headphones', 'Premium noise-cancelling wireless headphones', 99.99, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', 'Electronics', 50),
      ('Running Shoes', 'Lightweight and comfortable running shoes', 79.99, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', 'Footwear', 30),
      ('Backpack', 'Durable 30L hiking backpack', 59.99, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400', 'Accessories', 40),
      ('Mechanical Keyboard', 'RGB mechanical keyboard with tactile switches', 129.99, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400', 'Electronics', 25),
      ('Water Bottle', 'Insulated stainless steel water bottle 1L', 29.99, 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400', 'Accessories', 100),
      ('Sunglasses', 'Polarized UV400 sunglasses', 49.99, 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400', 'Accessories', 60),
      ('Smartwatch', 'Fitness tracking smartwatch with heart rate monitor', 199.99, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', 'Electronics', 20),
      ('Yoga Mat', 'Non-slip eco-friendly yoga mat', 39.99, 'https://images.unsplash.com/photo-1601925228713-c4b0df88e5c6?w=400', 'Sports', 45);
    `);
    console.log("Database seeded with sample products");
  }
};


