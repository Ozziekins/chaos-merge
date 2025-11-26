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

app.use(cors());
app.use(express.json());

app.use("/public", express.static(publicPath()));

// Routes
app.use("/api/upload", uploadRouter);
app.use("/api/merge", mergeRouter);

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.listen(env.port, () => {
  console.log(`API listening on http://localhost:${env.port}`);
}).on("error", (err: NodeJS.ErrnoException) => {
  if (err.code === "EADDRINUSE") {
    console.error(`Port ${env.port} is already in use. Please free the port or set API_PORT to a different value.`);
    process.exit(1);
  } else {
    console.error("Server error:", err);
    process.exit(1);
  }
});
