import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

import apiRoutes from './routes/index.js';
import { closePool } from './config/database.js';

dotenv.config({ path: '../.env' });

const app=express();
const PORT=process.env.PORT || 5500;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit:"10mb"}));
app.use(express.urlencoded({extended: true}));


const limiter=rateLimit({
  windowMs: (process.env.RATE_LIMIT_WINDOW||15)*60*1000,
  max: process.env.RATE_LIMIT_MAX||100,
  message: { error: "Too many requests", message: "Joohon baij bgad dahin oroldono uu!." },
});

// Бүх замыг нэгтгэсэн router-ээ ашиглах
app.use("/api", limiter);
app.use("/api", apiRoutes); 
// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});


app.use((req, res) => {
  res.status(404).json({ error: "oldsongui"});
});

// Global Error Handler (express-async-errors-ийн алдааг энд барина)
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(err.status || 500).json({
    error: "Internal Server Error",
    message: process.env.NODE_ENV === "development"?err.message:"Алдаа гарлаа",
  });
});

const server = app.listen(PORT, () => {
  console.log(`London website assan: http://localhost:${PORT}/api`);
});


const gracefulShutdown = async (signal) => {
  console.log(`${signal} huleen avlaa, server haagdaj bnaa...`);
  server.close(async () => {
    await closePool();
    process.exit(0);
  });
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

export default app;