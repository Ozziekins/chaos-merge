import fs from "fs";

// On Railway, if root directory is apps/api, process.cwd() will be apps/api
// For local dev, process.cwd() is the repo root
// Check if we're in the apps/api directory by checking if we're running from dist
const cwd = process.cwd();
const isInApiDir = cwd.endsWith("apps/api") || cwd.endsWith("api") || !fs.existsSync("apps");

export const env = {
    port: Number(process.env.PORT ?? process.env.API_PORT ?? 4000),
    uploadsDir: isInApiDir ? "uploads" : "apps/api/uploads",
    publicDir: isInApiDir ? "public" : "apps/api/public"
  };
  