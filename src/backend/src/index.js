import 'dotenv/config';
import express from 'express'
import cors from 'cors'
import { init } from "./db/seed.js"
import productsRouter from './routes/products.js'
import cartRouter from './routes/cart.js'


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health check — used by Kubernetes liveness/readiness probes
app.get("/health", (req, res) => res.json({ status: "ok" }));

// Routes
app.use("/api/products", productsRouter);
app.use("/api/cart", cartRouter);

// Start server
const start = async () => {
  try {
    await init();
    app.listen(PORT, () => {
      console.log(`Backend running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

start();
