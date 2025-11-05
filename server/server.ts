import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import pingRouter from "./routes/ping.js";
import authRouter from "./routes/auth.js";
import protectedRouter from "./routes/protected.js";

dotenv.config();

const app = express();
// middleware first
app.use(cors());
app.use(express.json());

connectDB();

const startServer = async () => {
  try {
    // mount router at /api so router's /ping becomes /api/ping
    app.use("/api", pingRouter);
    // app.use('/api/tasks', require('./routes/task.routes')); // Use when you add routes
    app.use("/api/auth", authRouter);
    app.use("/api/protected", protectedRouter);
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

startServer();
