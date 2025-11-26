import "dotenv/config";
import express from "express";
import cors from "cors";
import fs from "fs";
import { env } from "./config/env";
import { uploadRouter } from "./routes/uploadRoutes";
import { mergeRouter } from "./routes/mergeRoutes";
import { publicPath, uploadsPath } from "./services/pathService";

// Ensure directories exist
const ensureDirs = () => {
  try {
    [uploadsPath(), publicPath()].forEach((dir) => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Created directory: ${dir}`);
      }
    });
    console.log(`Uploads dir: ${uploadsPath()}`);
    console.log(`Public dir: ${publicPath()}`);
  } catch (error) {
    console.error("Error creating directories:", error);
    // Don't exit - let the server start and fail gracefully on first request
  }
};

ensureDirs();

const app = express();

// CORS configuration - allow all origins for now (can restrict later)
const corsOptions = {
  origin: true, // Allow all origins - change to specific list in production if needed
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders: ["Content-Length", "Content-Type"]
};

// Request logging middleware (for debugging)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  console.log(`Headers:`, JSON.stringify(req.headers, null, 2));
  next();
});

// CORS must be before other middleware
app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options("*", cors(corsOptions));

app.use(express.json({ limit: "100mb" })); // Increase limit for video uploads
app.use(express.urlencoded({ extended: true, limit: "100mb" }));

app.use("/public", express.static(publicPath()));

// Routes
app.use("/api/upload", uploadRouter);
app.use("/api/merge", mergeRouter);

// Root health check for Railway (must be before catch-all)
app.get("/", (req, res) => {
  try {
    console.log("Root route hit!");
    const response = { 
      ok: true,
      service: "chaos-merge-api",
      version: "1.0.0",
      timestamp: new Date().toISOString()
    };
    console.log("Sending response:", response);
    res.json(response);
  } catch (error) {
    console.error("Error in root route:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/health", (_req, res) => {
  try {
    res.json({ 
      ok: true,
      uploadsDir: uploadsPath(),
      publicDir: publicPath(),
      port: env.port,
      cwd: process.cwd(),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error in health route:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Catch-all for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handling middleware (must be last, with 4 parameters)
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Unhandled error:", err);
  console.error("Error stack:", err.stack);
  console.error("Request path:", req.path);
  console.error("Request method:", req.method);
  
  // Ensure response hasn't been sent
  if (!res.headersSent) {
    res.status(err.status || 500).json({ 
      error: err.message || "Internal server error",
      ...(process.env.NODE_ENV !== "production" && { stack: err.stack })
    });
  }
});

// Test that directories are accessible
console.log("Environment check:");
console.log(`- Port: ${env.port}`);
console.log(`- Uploads: ${uploadsPath()}`);
console.log(`- Public: ${publicPath()}`);
console.log(`- CWD: ${process.cwd()}`);
console.log(`- NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`- PORT env: ${process.env.PORT}`);

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  console.error("Stack:", error.stack);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

const server = app.listen(env.port, "0.0.0.0", () => {
  console.log(`✅ API listening on http://0.0.0.0:${env.port}`);
  console.log(`✅ Health check: http://0.0.0.0:${env.port}/api/health`);
  console.log(`✅ Root endpoint: http://0.0.0.0:${env.port}/`);
  console.log(`✅ Server ready to accept connections`);
  
  // Test that server is actually listening
  server.getConnections((err, count) => {
    if (err) {
      console.error("Error getting connection count:", err);
    } else {
      console.log(`✅ Server can accept connections (current: ${count})`);
    }
  });
}).on("error", (err: NodeJS.ErrnoException) => {
  if (err.code === "EADDRINUSE") {
    console.error(`Port ${env.port} is already in use. Please free the port or set API_PORT to a different value.`);
    process.exit(1);
  } else {
    console.error("Server error:", err);
    process.exit(1);
  }
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});
