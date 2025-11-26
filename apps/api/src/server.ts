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
  [uploadsPath(), publicPath()].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

ensureDirs();

const app = express();

// CORS configuration
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // List of allowed origins
    const allowedOrigins = [
      "https://chaos-merge.vercel.app",
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175"
    ];
    
    // Allow all Vercel preview deployments (they have patterns like chaos-merge-*.vercel.app)
    const isVercelPreview = origin.includes("vercel.app") && origin.includes("chaos-merge");
    
    if (allowedOrigins.includes(origin) || isVercelPreview) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/public", express.static(publicPath()));

// Routes
app.use("/api/upload", uploadRouter);
app.use("/api/merge", mergeRouter);

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.listen(env.port, "0.0.0.0", () => {
  console.log(`API listening on http://0.0.0.0:${env.port}`);
}).on("error", (err: NodeJS.ErrnoException) => {
  if (err.code === "EADDRINUSE") {
    console.error(`Port ${env.port} is already in use. Please free the port or set API_PORT to a different value.`);
    process.exit(1);
  } else {
    console.error("Server error:", err);
    process.exit(1);
  }
});
