require("dotenv").config();
const express = require("express");
const cors = require("cors");
const initDb = require("./db/seed");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health check — used by Kubernetes liveness/readiness probes
app.get("/health", (req, res) => res.json({ status: "ok" }));

// Routes
app.use("/api/products", require("./routes/products"));
app.use("/api/cart", require("./routes/cart"));

// Start server
const start = async () => {
  try {
    await initDb();
    app.listen(PORT, () => {
      console.log(`Backend running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

start();
