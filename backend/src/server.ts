import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cron from "node-cron";
import { connectDB } from "./config/db";
import userRoutes from "./routes/userRoute";
import reportRoute from "./routes/reportRoute";
import trendRoute from "./routes/trendRoute";
import statsRoute from "./routes/statsRoute";
import marketmapRoute from "./routes/marketmapRoute";
import productRoute from "./routes/productRoute";
import adminRoutes from "./routes/adminRoute";
import { pingMLService } from "./services/mlService";

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

let isConnected = false;
app.use(async (_req, _res, next) => {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
  next();
});

app.get("/", (_req, res) => {
  res.send("FairPrice AI Server is running");
});

app.get("/api/warmup", async (_req, res) => {
  const alive = await pingMLService();
  res.json({ warm: alive });
});

app.use("/api/users", userRoutes);
app.use("/api/reports", reportRoute);
app.use("/api/stats", statsRoute);
app.use("/api/trends", trendRoute);
app.use("/api/markets", marketmapRoute);
app.use("/api/products", productRoute);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);

  console.log("Warming ML service on startup...");
  const warm = await pingMLService().catch(() => false);
  console.log(`ML warm on startup: ${warm ? "ready" : "unreachable"}`);

  cron.schedule("*/10 * * * *", async () => {
    const alive = await pingMLService();
    console.log(`ML service ping: ${alive ? "alive" : "unreachable"}`);
  });

  console.log("ML keepalive scheduler started — pinging every 10 minutes");
});

export default app;