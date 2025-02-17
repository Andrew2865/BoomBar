require("dotenv").config({ path: "./.env" });
const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        email TEXT NOT NULL,
        items JSON NOT NULL,
        total_price DECIMAL NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("✅ Tables initialized");
  } catch (error) {
    console.error("❌ Error initializing tables:", error);
  }
};

initDB();

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const { rows } = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name, email, hashedPassword]
    );
    res.json(rows[0]);
  } catch (err) {
    if (err.code === "23505") {
      return res.status(400).json({ error: "❌ Email already exists!" });
    }
    console.error(err);
    res.status(500).json({ error: "❌ Server error during registration!" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (rows.length === 0) return res.status(400).json({ error: "❌ User not found!" });

    const isValid = await bcrypt.compare(password, rows[0].password);
    if (!isValid) return res.status(400).json({ error: "❌ Incorrect password!" });

    const token = jwt.sign({ userId: rows[0].id }, process.env.SECRET_KEY, { expiresIn: "1h" });
    res.json({
      token,
      user: {
        id: rows[0].id,
        name: rows[0].name,
        email: rows[0].email,
        role: rows[0].role || 'user',
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "❌ Server error during login!" });
  }
});

app.post("/order", async (req, res) => {
  const { userId, email, cart, totalPrice } = req.body;

  if (!email || !cart.length) {
    return res.status(400).json({ error: "❌ Brak danych zamówienia!" });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const { rows } = await client.query(
      "INSERT INTO orders (user_id, email, items, total_price) VALUES ($1, $2, $3, $4) RETURNING id",
      [userId, email, JSON.stringify(cart), totalPrice]
    );

    const orderId = rows[0].id;

    await client.query("COMMIT");

    res.json({ message: "✅ Zamówienie złożone pomyślnie!", orderId });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Błąd składania zamówienia:", err);
    res.status(500).json({ error: "❌ Błąd serwera przy składaniu zamówienia!" });
  } finally {
    client.release();
  }
});
app.get("/products", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM products");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "❌ Server error while fetching products!" });
  }
});

app.get("/categories", async (req, res) => {
try {
  const { rows } = await pool.query("SELECT * FROM categories");
  res.json(rows);
} catch (err) {
  console.error("Error fetching categories:", err);
  res.status(500).json({ error: "❌ Server error while fetching categories!" });
}
});
app.post("/products", async (req, res) => {
  const { name, price, category, image_url, description } = req.body;
  try {
      const categoryResult = await pool.query("SELECT id FROM categories WHERE name = $1", [category]);
      if (categoryResult.rows.length === 0) {
          return res.status(400).json({ error: "❌ Kategoria nie istnieje!" });
      }
      const category_id = categoryResult.rows[0].id;
      const { rows } = await pool.query(
          "INSERT INTO products (name, price, category_id, image_url, description) VALUES ($1, $2, $3, $4, $5) RETURNING *",
          [name, price, category_id, image_url, description]
      );
      res.json(rows[0]);
  } catch (err) {
      console.error("Error adding product:", err);
      res.status(500).json({ error: "❌ Server error while adding product!" });
  }
});
app.delete("/products/name/:name", async (req, res) => {
  const { name } = req.params;
  try {
      const { rowCount } = await pool.query("DELETE FROM products WHERE name = $1", [name]);
      if (rowCount === 0) {
          return res.status(404).json({ error: "❌ Product not found!" });
      }
      res.json({ message: "✅ Product deleted!" });
  } catch (err) {
      console.error("Error deleting product:", err);
      res.status(500).json({ error: "❌ Server error while deleting product!" });
  }
});
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});