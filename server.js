// server.js — production-ready template
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");
const hpp = require("hpp");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
console.log("----- SMTP CONFIG CHECK -----");
console.log("SMTP_HOST =", process.env.SMTP_HOST);
console.log("SMTP_PORT =", process.env.SMTP_PORT);
console.log("SMTP_USER =", process.env.SMTP_USER);
console.log("SMTP_PASS length =", process.env.SMTP_PASS?.length);
console.log("------------------------------");
const authRoutes = require("./routes/authRoutes");
const { errorHandler } = require("./middlewares/errorHandler");

const app = express();

// Trust proxy (if behind nginx / heroku / cloud provider)
app.set("trust proxy", 1);

// Basic security middlewares
app.use(helmet()); // set security-related HTTP headers
app.use(xss()); // sanitize user input
app.use(hpp()); // prevent HTTP parameter pollution
app.use(compression()); // gzip responses

// Logging (only in development)
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Body parsers & cookie parser
app.use(express.json({ limit: "10kb" })); // limit body size
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// CORS
const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:3000";
app.use(
  cors({
    origin: corsOrigin,
    credentials: true, // allow cookies to be sent
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

// Rate limiting (global, tweak as needed)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: Number(process.env.RATE_LIMIT_MAX) || 100, // requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
});
app.use(limiter);

// Mount API routes
app.use("/api/auth", authRoutes);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});

// 404 handler (should come after routes)
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Error handling middleware (your centralized handler)
app.use(errorHandler);

// ---------- MongoDB Connect & Server Start ----------
const startServer = async () => {
  try {
    // Mongoose connection options commonly used in production
    const mongooseOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex/useFindAndModify are no longer needed in newer mongoose
    };

    await mongoose.connect(process.env.MONGODB_URI, mongooseOptions);
    console.log("✅ MongoDB connected successfully");

    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

    // Graceful shutdown on SIGTERM (platforms like Heroku send SIGTERM)
    process.on("SIGTERM", () => {
      console.info("SIGTERM received — shutting down gracefully");
      server.close(() => {
        mongoose.connection.close(false, () => {
          console.log("Mongo connection closed");
          process.exit(0);
        });
      });
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
};

startServer();

// Global error handlers
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  // optional: give time to log and then exit
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

module.exports = app;
