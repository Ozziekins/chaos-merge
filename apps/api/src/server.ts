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

app.use(cors(corsOptions));
app.use(express.json());

app.use("/public", express.static(publicPath()));

// Routes
app.use("/api/upload", uploadRouter);
app.use("/api/merge", mergeRouter);

app.get("/api/health", (_req, res) => {
  res.json({ 
    ok: true,
    uploadsDir: uploadsPath(),
    publicDir: publicPath(),
    port: env.port,
    cwd: process.cwd()
  });
});

// Catch-all for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handling middleware (must be last, with 4 parameters)
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(err.status || 500).json({ 
    error: err.message || "Internal server error",
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack })
  });
});

// Test that directories are accessible
console.log("Environment check:");
console.log(`- Port: ${env.port}`);
console.log(`- Uploads: ${uploadsPath()}`);
console.log(`- Public: ${publicPath()}`);
console.log(`- CWD: ${process.cwd()}`);

app.listen(env.port, "0.0.0.0", () => {
  console.log(`✅ API listening on http://0.0.0.0:${env.port}`);
  console.log(`✅ Health check: http://0.0.0.0:${env.port}/api/health`);
}).on("error", (err: NodeJS.ErrnoException) => {
  if (err.code === "EADDRINUSE") {
    console.error(`Port ${env.port} is already in use. Please free the port or set API_PORT to a different value.`);
    process.exit(1);
  } else {
    console.error("Server error:", err);
    process.exit(1);
  }
});
