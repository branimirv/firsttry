import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRouter from "./routes/auth.js";
import protectedRouter from "./routes/protected.js";
import { errorHandler } from "./middleware/errorHandler.js";
import mongoose from "mongoose";
import eventRouter from "./routes/event.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/protected", protectedRouter);
app.use("/api/events", eventRouter);

// Error handler middleware (must be last)
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    });

    // graceful shutdown
    const gracefulShutdown = (signal: string) => {
      console.log(`\n${signal} received. Starting graceful shutdown...`);

      server.close(async () => {
        console.log("HTTP server closed");

        try {
          await mongoose.connection.close();
          console.log("MongoDB connection closed");
          process.exit(0); // Exit success
        } catch (error) {
          console.error("Error closing MongoDB connection:", error);
          process.exit(1); // Exit error
        }
      });

      setTimeout(() => {
        console.log("Forced shutdown after timeout");
        process.exit(1);
      }, 1000);
    };

    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));

    // Handle unhandled promise rejections
    process.on("unhandledRejection", (err: Error) => {
      console.error("Unhandled Promise Rejection:", err);
      gracefulShutdown("unhandledRejection");
    });

    // Handle uncaught exceptions
    process.on("uncaughtException", (err: Error) => {
      console.error("Uncaught Exception:", err);
      gracefulShutdown("uncaughtException");
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

startServer();
