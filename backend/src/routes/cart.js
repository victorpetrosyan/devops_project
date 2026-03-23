const express = require("express");
const router = express.Router();
const pool = require("../db");

// Cart is session-based (stored in memory per session_id header)
// In production you'd use Redis, but for a portfolio project this is fine

// GET cart by session
router.get("/:sessionId", async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT c.id, c.quantity, c.session_id,
              p.id as product_id, p.name, p.price, p.image_url
       FROM cart c
       JOIN products p ON c.product_id = p.id
       WHERE c.session_id = $1`,
      [req.params.sessionId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
});

// POST add item to cart
router.post("/", async (req, res) => {
  try {
    const { session_id, product_id, quantity = 1 } = req.body;
    if (!session_id || !product_id) {
      return res.status(400).json({ error: "session_id and product_id are required" });
    }

    // Check if item already in cart
    const existing = await pool.query(
      "SELECT * FROM cart WHERE session_id = $1 AND product_id = $2",
      [session_id, product_id]
    );

    if (existing.rows.length > 0) {
      // Update quantity
      const { rows } = await pool.query(
        "UPDATE cart SET quantity = quantity + $1 WHERE session_id = $2 AND product_id = $3 RETURNING *",
        [quantity, session_id, product_id]
      );
      return res.json(rows[0]);
    }

    // Insert new item
    const { rows } = await pool.query(
      "INSERT INTO cart (session_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *",
      [session_id, product_id, quantity]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add to cart" });
  }
});

// PATCH update quantity
router.patch("/:id", async (req, res) => {
  try {
    const { quantity } = req.body;
    if (quantity < 1) {
      await pool.query("DELETE FROM cart WHERE id = $1", [req.params.id]);
      return res.json({ message: "Item removed" });
    }
    const { rows } = await pool.query(
      "UPDATE cart SET quantity = $1 WHERE id = $2 RETURNING *",
      [quantity, req.params.id]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update cart" });
  }
});

// DELETE remove item
router.delete("/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM cart WHERE id = $1", [req.params.id]);
    res.json({ message: "Item removed from cart" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to remove item" });
  }
});

module.exports = router;
