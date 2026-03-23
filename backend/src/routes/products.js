const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET all products (with optional category filter)
router.get("/", async (req, res) => {
  try {
    const { category } = req.query;
    let query = "SELECT * FROM products ORDER BY created_at DESC";
    let params = [];

    if (category) {
      query = "SELECT * FROM products WHERE category = $1 ORDER BY created_at DESC";
      params = [category];
    }

    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// GET single product
router.get("/:id", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM products WHERE id = $1",
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: "Product not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

// GET all categories
router.get("/meta/categories", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT DISTINCT category FROM products ORDER BY category"
    );
    res.json(rows.map((r) => r.category));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

module.exports = router;
